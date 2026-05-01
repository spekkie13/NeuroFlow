import { Workspace } from "@/app/models/Workspace"
import { User } from "@/app/models/User"

export interface SettingsViewProps {
    user: User
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    onAddWorkspace: (name: string) => void
    onUpdateWorkspace: (accountId: string, name: string) => void
    onDeleteWorkspace: (accountId: string) => void
    onSwitchWorkspace: (accountId: string) => void
    onSetDailyBudget: (workspaceId: string, minutes: number | null) => void
    onSignOut: () => Promise<void>
}
