import { Project } from "@/app/models/Project";
import { Task } from "@/app/models/Task";

export interface TaskViewProps {
    project: Project
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onDeleteTask: (taskId: string) => void
    onMoveTask?: (taskId: string, direction: 'up' | 'down') => void
}
