import {Account} from "@/app/models/Account";

export interface SettingsViewProps {
    accounts: Account[]
    currentWorkspaceId: string | null
    onAddWorkspace: (name: string) => void
    onUpdateWorkspace: (accountId: string, name: string) => void
    onDeleteWorkspace: (accountId: string) => void
    onSwitchWorkspace: (accountId: string) => void
}
