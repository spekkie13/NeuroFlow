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
            const localWorkspaces: Workspace[] = await loadWorkspaces()
            const savedId: string = await getCurrentWorkspaceId()
            if (!mounted) return

            if (localWorkspaces.length > 0) {
                // Fast path: show local data immediately, sync in background
                setWorkspaces(localWorkspaces)
                const validId: string =
                    savedId && localWorkspaces.some((a: Workspace) => a.id === savedId)
                        ? savedId
                        : localWorkspaces[0]?.id ?? null
                if (validId) {
                    setCurrentId(validId)
                    await setCurrentWorkspaceId(validId)
                }
                setIsLoading(false)

                if (userId) {
                    syncWorkspaces().then(async (merged: Workspace[]) => {
                        if (!mounted || !merged) return
                        setWorkspaces(merged)
                        const stillValid: boolean = merged.some((w: Workspace) => w.id === validId)
                        if (!stillValid && merged.length > 0) {
                            const firstId: string = merged[0].id
                            setCurrentId(firstId)
                            await setCurrentWorkspaceId(firstId)
                        }
                    })
                }
                return
            }

            // Slow path: local storage is empty — wait for sync before creating default
            let workspacesToShow: Workspace[] = []
            if (userId) {
                const merged: Workspace[] | null = await syncWorkspaces()
                if (!mounted) return
                if (merged !== null) {
                    workspacesToShow = merged
                } else {
                    // Sync failed — don't create a phantom default workspace for existing users.
                    // Surface the error and bail; the user can retry by restarting the app.
                    setSyncError('Could not reach the server. Check your connection and reopen the app.')
                    setIsLoading(false)
                    return
                }
            }

            if (workspacesToShow.length === 0) {
                const defaultWorkspace: Workspace = {
                    id: generateId(),
                    name: 'My Workspace',
                    createdAt: new Date().toISOString(),
                }
                await saveAccounts([defaultWorkspace])
                await setCurrentWorkspaceId(defaultWorkspace.id)
                workspacesToShow = [defaultWorkspace]
                if (userId) await pushWorkspace(defaultWorkspace)
            }

            if (!mounted) return
            setWorkspaces(workspacesToShow)
            const validId: string =
                savedId && workspacesToShow.some((a: Workspace) => a.id === savedId)
                    ? savedId
                    : workspacesToShow[0]?.id ?? null
            if (validId) {
                setCurrentId(validId)
                await setCurrentWorkspaceId(validId)
            }
            setIsLoading(false)
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
