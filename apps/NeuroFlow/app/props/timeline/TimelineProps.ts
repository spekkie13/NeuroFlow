import {Project, Task} from "../../models";

export interface TimelineProps {
    project: Project
    dailyMinutes?: number | null
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}
