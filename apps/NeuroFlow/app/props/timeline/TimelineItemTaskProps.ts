import {Task} from "../../models";

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
