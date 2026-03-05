import { Task } from "@/app/models/Task";

export interface TimelineTaskItemProps {
    task: Task
    dateLabel: string
    projectColor: string
    onToggleComplete: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
    canMoveUp: boolean
    canMoveDown: boolean
}
