import { useEffect, useState } from 'react'
import {
    getCurrentWorkspaceId,
    loadWorkspaces,
    saveAccounts,
    setCurrentWorkspaceId,
} from '../services/storage/accountStorage'
import { Workspace } from "@/app/models/Workspace";
import { generateId } from '@/app/utils/idUtils'

interface UseAccountsResult {
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    isLoading: boolean
    addWorkspace: (name: string) => Promise<void>
    updateWorkspace: (id: string, name: string) => Promise<void>
    deleteWorkspace: (id: string) => Promise<void>
    switchWorkspace: (id: string) => Promise<void>
    setDailyBudget: (id: string, minutes: number | null) => Promise<void>
}

export function useWorkspaces(): UseAccountsResult {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [currentWorkspaceId, setCurrentId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const init = async () => {
            const loadedWorkspaces = await loadWorkspaces()
            const savedId = await getCurrentWorkspaceId()
            if (!mounted) return

            setWorkspaces(loadedWorkspaces)
            const validId =
                savedId && loadedWorkspaces.some((a) => a.id === savedId)
                    ? savedId
                    : loadedWorkspaces[0]?.id ?? null

            if (validId) {
                setCurrentId(validId)
                await setCurrentWorkspaceId(validId)
            }

            setIsLoading(false)
        }
        init()
        return () => {
            mounted = false
        }
    }, [])

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
        }
        const next = [...workspaces, newWorkspace]
        await persist(next)
    }

    const updateWorkspace = async (id: string, name: string) => {
        const next = workspaces.map((a) =>
            a.id === id
                ? {
                    ...a,
                    name,
                }
                : a,
        )
        await persist(next)
    }

    const deleteWorkspace = async (id: string) => {
        if (workspaces.length <= 1) {
            return
        }
        const next = workspaces.filter((a) => a.id !== id)
        await persist(next)

        if (currentWorkspaceId === id && next.length > 0) {
            const newId = next[0].id
            setCurrentId(newId)
            await setCurrentWorkspaceId(newId)
        }
    }

    const switchWorkspace = async (id: string) => {
        setCurrentId(id)
        await setCurrentWorkspaceId(id)
    }

    const setDailyBudget = async (id: string, minutes: number | null) => {
        const next = workspaces.map((a) =>
            a.id === id ? { ...a, dailyMinutes: minutes ?? undefined } : a
        )
        await persist(next)
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
