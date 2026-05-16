import {Workspace} from "../Workspace";

export interface UseAccountsResult {
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    isLoading: boolean
    syncError: string | null
    addWorkspace: (name: string) => Promise<void>
    updateWorkspace: (id: string, name: string) => Promise<void>
    deleteWorkspace: (id: string) => Promise<void>
    switchWorkspace: (id: string) => Promise<void>
    setDailyBudget: (id: string, minutes: number | null) => Promise<void>
}
