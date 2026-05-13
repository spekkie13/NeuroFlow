import {Workspace} from "../../models/Workspace";
import {User} from "../../models";

export interface SettingsViewProps {
    user: User
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    globalReminderTime: string | null
    onAddWorkspace: (name: string) => void
    onUpdateWorkspace: (accountId: string, name: string) => void
    onDeleteWorkspace: (accountId: string) => void
    onSwitchWorkspace: (accountId: string) => void
    onSetDailyBudget: (workspaceId: string, minutes: number | null) => void
    onSetGlobalReminder: (time: string | null) => void
    onSignOut: () => Promise<void>
}
