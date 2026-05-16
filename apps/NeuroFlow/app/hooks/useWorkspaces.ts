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
    const [syncError, setSyncError] = useState<string | null>(null)

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
        return () => { mounted = false }
    }, [userId])

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
        if (userId) {
            const synced: Workspace | null = await pushWorkspace(newWorkspace)
            if (!synced)
                setSyncError(`Changes for workspace "${newWorkspace.name}" couldn't be synced. They're saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const updateWorkspace = async (id: string, name: string) => {
        const updatedAt: string = new Date().toISOString()
        const next: Workspace[] = workspaces.map((a: Workspace) =>
            a.id === id ? { ...a, name, updatedAt } : a
        )
        await persist(next)
        const updated: Workspace = next.find((a: Workspace) => a.id === id)
        if (userId && updated) {
            const synced: Workspace | null = await pushWorkspace(updated)
            if (!synced)
                setSyncError(`Changes for workspace "${updated.name}" couldn't be synced. They're saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const deleteWorkspace = async (id: string) => {
        if (workspaces.length <= 1) return
        const target: Workspace = workspaces.find((a: Workspace) => a.id === id)
        const next: Workspace[] = workspaces.filter((a: Workspace) => a.id !== id)
        await persist(next)

        if (currentWorkspaceId === id && next.length > 0) {
            const newId: string = next[0].id
            setCurrentId(newId)
            await setCurrentWorkspaceId(newId)
        }

        if (userId) {
            const deleted: boolean = await deleteRemoteWorkspace(id)
            if (!deleted)
                setSyncError(`Workspace "${target?.name}" couldn't be deleted from the server. It's removed on this device.`)
            else
                setSyncError(null)
        }
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
        if (userId && updated) {
            const synced: Workspace | null = await pushWorkspace(updated)
            if (!synced)
                setSyncError(`Budget changes for workspace "${updated.name}" couldn't be synced. They're saved on this device.`)
            else
                setSyncError(null)
        }
    }

    return {
        workspaces,
        currentWorkspaceId,
        isLoading,
        syncError,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        switchWorkspace,
        setDailyBudget,
    }
}
