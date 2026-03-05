import { Workspace } from "@/app/models/Workspace";
import { getJsonItem, removeItem, setJsonItem } from './baseStorage'

const ACCOUNTS_KEY = 'adhd-planner:accounts'
const CURRENT_ACCOUNT_KEY = 'adhd-planner:accounts:current'

export async function loadWorkspaces(): Promise<Workspace[]> {
    const stored = await getJsonItem<Workspace[]>(ACCOUNTS_KEY)
    if (!stored || stored.length === 0) {
        const defaultAccount: Workspace = {
            id: Date.now().toString(),
            name: 'My Workspace',
            createdAt: new Date().toISOString(),
        }
        await setJsonItem(ACCOUNTS_KEY, [defaultAccount])
        await setCurrentWorkspaceId(defaultAccount.id)
        return [defaultAccount]
    }
    return stored
}

export async function saveAccounts(accounts: Workspace[]): Promise<void> {
    await setJsonItem(ACCOUNTS_KEY, accounts)
}

export async function setCurrentWorkspaceId(id: string): Promise<void> {
    await setJsonItem(CURRENT_ACCOUNT_KEY, id)
}

export async function getCurrentWorkspaceId(): Promise<string | null> {
    const id = await getJsonItem<string>(CURRENT_ACCOUNT_KEY)
    return id ?? null
}

export async function clearCurrentAccount(): Promise<void> {
    await removeItem(CURRENT_ACCOUNT_KEY)
}
