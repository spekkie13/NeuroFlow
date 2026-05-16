import { getJsonItem, setJsonItem } from './baseStorage'
import {Workspace} from "../../models/Workspace";

const ACCOUNTS_KEY = 'adhd-planner:accounts'
const CURRENT_ACCOUNT_KEY = 'adhd-planner:accounts:current'

export async function loadWorkspaces(): Promise<Workspace[]> {
    const stored: Workspace[] = await getJsonItem<Workspace[]>(ACCOUNTS_KEY)
    return stored ?? []
}

export async function saveAccounts(accounts: Workspace[]): Promise<void> {
    await setJsonItem(ACCOUNTS_KEY, accounts)
}

export async function setCurrentWorkspaceId(id: string): Promise<void> {
    await setJsonItem(CURRENT_ACCOUNT_KEY, id)
}

export async function getCurrentWorkspaceId(): Promise<string | null> {
    const id: string = await getJsonItem<string>(CURRENT_ACCOUNT_KEY)
    return id ?? null
}
