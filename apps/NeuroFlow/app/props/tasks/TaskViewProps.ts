import {Project, Task, Routine} from "../../models";
import {Workspace} from "../../models/Workspace";

export interface TaskViewProps {
    project: Project
    otherProjects?: Project[]
    workspaces?: Workspace[]
    currentWorkspaceId?: string | null
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onDeleteTask: (taskId: string) => void
    onMoveTask?: (taskId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void
    onMoveTaskToProject?: (taskId: string, targetProjectId: string) => void
    onMoveTaskToWorkspace?: (taskId: string, targetWorkspaceId: string, targetProjectId: string) => void
    onAddRoutine: (routine: Routine) => void
    onUpdateRoutine: (routineId: string, updates: Partial<Routine>) => void
    onDeleteRoutine: (routineId: string) => void
}
