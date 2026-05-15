import { useEffect, useState } from 'react'
import {
    getCurrentWorkspaceId,
    loadWorkspaces,
    saveAccounts,
    setCurrentWorkspaceId,
} from '../services/storage/accountStorage'
import {Workspace} from "../models/Workspace";
import {deleteRemoteWorkspace, pushWorkspace, syncWorkspaces} from "../services/sync/SyncService";
import {generateId} from "../utils/idUtils";
import {UseAccountsResult} from "../models/hooks/UseAccountsResult";

export function useWorkspaces(userId: string | null): UseAccountsResult {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [currentWorkspaceId, setCurrentId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted: boolean = true
        const init = async () => {
            const loadedWorkspaces: Workspace[] = await loadWorkspaces()
            const savedId: string = await getCurrentWorkspaceId()
            if (!mounted) return

            setWorkspaces(loadedWorkspaces)
            const validId: string =
                savedId && loadedWorkspaces.some((a: Workspace) => a.id === savedId)
                    ? savedId
                    : loadedWorkspaces[0]?.id ?? null

            if (validId) {
                setCurrentId(validId)
                await setCurrentWorkspaceId(validId)
            }

            setIsLoading(false)

            // Background sync: fetch from Supabase and merge if we have a user
            if (userId) {
                syncWorkspaces().then(async (merged: Workspace[]) => {
                    if (!mounted || !merged) return
                    setWorkspaces(merged)
                    if (!validId && merged.length > 0) {
                        const firstId: string = merged[0].id
                        setCurrentId(firstId)
                        await setCurrentWorkspaceId(firstId)
                    }
                })
            }
        }
        init()
        return () => {
            mounted = false
        }
    }, [userId])

    // Optimistic update: apply state immediately, then persist to storage.
    const persist = async (next: Workspace[]): Promise<void> => {
        setWorkspaces(next)
        await saveAccounts(next)
    }

    const addWorkspace = async (name: string) => {
        const newWorkspace: Workspace = {
            id: generateId(),
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        const next: Workspace[] = [...workspaces, newWorkspace]
        await persist(next)
        if (userId)
            await pushWorkspace(newWorkspace)
    }

    const updateWorkspace = async (id: string, name: string) => {
        const updatedAt: string = new Date().toISOString()
        const next: Workspace[] = workspaces.map((a: Workspace) =>
            a.id === id
                ? { ...a, name, updatedAt }
                : a,
        )
        await persist(next)
        const updated: Workspace = next.find((a: Workspace) => a.id === id)
        if (userId && updated)
            await pushWorkspace(updated)
    }

    const deleteWorkspace = async (id: string) => {
        if (workspaces.length <= 1) {
            return
        }
        const next: Workspace[] = workspaces.filter((a: Workspace) => a.id !== id)
        await persist(next)

        if (currentWorkspaceId === id && next.length > 0) {
            const newId: string = next[0].id
            setCurrentId(newId)
            await setCurrentWorkspaceId(newId)
        }

        if (userId)
            deleteRemoteWorkspace(id)
    }

    const switchWorkspace = async (id: string) => {
        setCurrentId(id)
        await setCurrentWorkspaceId(id)
    }

    const setDailyBudget = async (id: string, minutes: number | null) => {
        const updatedAt: string = new Date().toISOString()
        const next: Workspace[] = workspaces.map((a: Workspace) =>
            a.id === id ? { ...a, dailyMinutes: minutes ?? undefined, updatedAt } : a
        )
        await persist(next)
        const updated: Workspace = next.find((a: Workspace) => a.id === id)
        if (userId && updated)
            await pushWorkspace(updated)
    }

    return {
        workspaces: workspaces,
        currentWorkspaceId: currentWorkspaceId,
        isLoading,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        switchWorkspace,
        setDailyBudget,
    }
}
