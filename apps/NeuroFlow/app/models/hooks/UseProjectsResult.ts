import {Project} from "../Project";
import {Task} from "../Task";
import {Routine} from "../Routine";
import {TaskMoveDirection} from "../task/TaskMoveDirection";

export interface UseProjectsResult {
    projects: Project[]
    isLoading: boolean
    syncError: string | null
    addProject: (name: string, color?: string, reminderTime?: string | null) => Promise<void>
    updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>
    deleteProject: (projectId: string) => Promise<void>
    addTask: (projectId: string, task: Task) => Promise<void>
    updateTask: (
        projectId: string,
        taskId: string,
        updates: Partial<Task>,
    ) => Promise<void>
    deleteTask: (projectId: string, taskId: string) => Promise<void>
    moveTask: (
        projectId: string,
        taskId: string,
        direction: TaskMoveDirection,
    ) => Promise<void>
    addRoutine: (projectId: string, routine: Routine) => Promise<void>
    updateRoutine: (projectId: string, routineId: string, updates: Partial<Routine>) => Promise<void>
    deleteRoutine: (projectId: string, routineId: string) => Promise<void>
}
