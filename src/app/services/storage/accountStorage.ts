// services/storage/accountStorage.ts
import { Account } from '@/app/utils/types'
import {
    getJsonItem,
    removeItem,
    setJsonItem,
} from './baseStorage'

const ACCOUNTS_KEY = 'adhd-planner:accounts'
const CURRENT_ACCOUNT_KEY = 'adhd-planner:accounts:current'

export async function loadAccounts(): Promise<Account[]> {
    const stored = await getJsonItem<Account[]>(ACCOUNTS_KEY)
    if (!stored || stored.length === 0) {
        const defaultAccount: Account = {
            id: Date.now().toString(),
            name: 'My Workspace',
            createdAt: new Date().toISOString(),
        }
        await setJsonItem(ACCOUNTS_KEY, [defaultAccount])
        await setCurrentAccountId(defaultAccount.id)
        return [defaultAccount]
    }
    return stored
}

export async function saveAccounts(accounts: Account[]): Promise<void> {
    await setJsonItem(ACCOUNTS_KEY, accounts)
}

export async function setCurrentAccountId(id: string): Promise<void> {
    await setJsonItem(CURRENT_ACCOUNT_KEY, id)
}

export async function getCurrentAccountId(): Promise<string | null> {
    const id = await getJsonItem<string>(CURRENT_ACCOUNT_KEY)
    return id ?? null
}

export async function clearCurrentAccount(): Promise<void> {
    await removeItem(CURRENT_ACCOUNT_KEY)
}
