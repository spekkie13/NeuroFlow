import {Workspace} from "@/app/models/Workspace";

export interface SettingsViewProps {
    workspaces: Workspace[]
    currentWorkspaceId: string | null
    onAddWorkspace: (name: string) => void
    onUpdateWorkspace: (accountId: string, name: string) => void
    onDeleteWorkspace: (accountId: string) => void
    onSwitchWorkspace: (accountId: string) => void
}
