import { StorageClient } from './storageClient'
import { Workspace } from "@/app/models/Workspace";
import { Project } from "@/app/models/Project";

const PROJECTS_KEY_PREFIX = 'adhd-planner-projects-'
const ACCOUNTS_KEY = 'adhd-planner-accounts'
const CURRENT_ACCOUNT_KEY = 'adhd-planner-current-account'

/* -------------------------------------------------------------------------- */
/*                                PROJECTS                                    */
/* -------------------------------------------------------------------------- */

export async function saveProjects(
    projects: Project[],
    accountId: string,
): Promise<void> {
    const key = `${PROJECTS_KEY_PREFIX}${accountId}`
    await StorageClient.setItem<Project[]>(key, projects)
}

export async function loadProjects(accountId: string): Promise<Project[]> {
    const key = `${PROJECTS_KEY_PREFIX}${accountId}`
    const stored = await StorageClient.getItem<Project[]>(key)
    return stored ?? []
}

/* -------------------------------------------------------------------------- */
/*                                ACCOUNTS                                    */
/* -------------------------------------------------------------------------- */

export async function saveAccounts(accounts: Workspace[]): Promise<void> {
    await StorageClient.setItem<Workspace[]>(ACCOUNTS_KEY, accounts)
}

export async function loadAccounts(): Promise<Workspace[]> {
    const stored = await StorageClient.getItem<Workspace[]>(ACCOUNTS_KEY)

    // Geen accounts? Maak er eentje aan als default
    if (!stored || stored.length === 0) {
        const defaultAccount: Workspace = {
            id: Date.now().toString(),
            name: 'My Account',
            createdAt: new Date().toISOString(),
        }

        const accounts = [defaultAccount]
        await saveAccounts(accounts)
        await setCurrentAccount(defaultAccount.id)

        return accounts
    }

    return stored
}

/* -------------------------------------------------------------------------- */
/*                             CURRENT ACCOUNT                                */
/* -------------------------------------------------------------------------- */

export async function setCurrentAccount(accountId: string): Promise<void> {
    // We slaan dit als simpele string op; JSON.stringify op een string is ok
    await StorageClient.setItem<string>(CURRENT_ACCOUNT_KEY, accountId)
}

export async function getCurrentAccount(): Promise<string | null> {
    const stored = await StorageClient.getItem<string>(CURRENT_ACCOUNT_KEY)
    return stored ?? null
}
