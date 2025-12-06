import {Project, Task} from "@/app/utils/types";

export type MoveDirection = 'up' | 'down'

export interface TaskViewProps {
    project: Project
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onDeleteTask: (taskId: string) => void
    onMoveTask?: (taskId: string, direction: MoveDirection) => void
}
