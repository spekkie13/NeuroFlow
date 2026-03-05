import { Project } from "@/app/models/Project";
import { Task } from "@/app/models/Task";

export interface TimelineProps {
    project: Project
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}
