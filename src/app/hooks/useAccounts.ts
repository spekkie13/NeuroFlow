// hooks/useAccounts.ts
import { useEffect, useState } from 'react'
import { Account } from '../utils/types'
import {
    getCurrentAccountId,
    loadAccounts,
    saveAccounts,
    setCurrentAccountId,
} from '../services/storage/accountStorage'

interface UseAccountsResult {
    accounts: Account[]
    currentAccountId: string | null
    isLoading: boolean
    addAccount: (name: string) => Promise<void>
    updateAccount: (id: string, name: string) => Promise<void>
    deleteAccount: (id: string) => Promise<void>
    switchAccount: (id: string) => Promise<void>
}

export function useAccounts(): UseAccountsResult {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [currentAccountId, setCurrentId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const init = async () => {
            const loadedAccounts = await loadAccounts()
            const savedId = await getCurrentAccountId()
            if (!mounted) return

            setAccounts(loadedAccounts)
            const validId =
                savedId && loadedAccounts.some((a) => a.id === savedId)
                    ? savedId
                    : loadedAccounts[0]?.id ?? null

            if (validId) {
                setCurrentId(validId)
                await setCurrentAccountId(validId)
            }

            setIsLoading(false)
        }
        init()
        return () => {
            mounted = false
        }
    }, [])

    const persist = async (next: Account[]) => {
        setAccounts(next)
        await saveAccounts(next)
    }

    const addAccount = async (name: string) => {
        const newAcc: Account = {
            id: Date.now().toString(),
            name,
            createdAt: new Date().toISOString(),
        }
        const next = [...accounts, newAcc]
        await persist(next)
    }

    const updateAccount = async (id: string, name: string) => {
        const next = accounts.map((a) =>
            a.id === id
                ? {
                    ...a,
                    name,
                }
                : a,
        )
        await persist(next)
    }

    const deleteAccount = async (id: string) => {
        if (accounts.length <= 1) {
            // voorkomt verwijdering laatste account; UI kan hierop inspelen
            return
        }
        const next = accounts.filter((a) => a.id !== id)
        await persist(next)

        if (currentAccountId === id && next.length > 0) {
            const newId = next[0].id
            setCurrentId(newId)
            await setCurrentAccountId(newId)
        }
    }

    const switchAccount = async (id: string) => {
        setCurrentId(id)
        await setCurrentAccountId(id)
    }

    return {
        accounts,
        currentAccountId,
        isLoading,
        addAccount,
        updateAccount,
        deleteAccount,
        switchAccount,
    }
}
