import {Step, Task} from "../../models";

export interface TaskItemProps {
    task: Task
    isEditing: boolean
    editName: string
    menuOpen: boolean
    canMoveUp: boolean
    canMoveDown: boolean
    canMoveToTop: boolean
    canMoveToBottom: boolean
    showMoveActions: boolean
    onEditNameChange: (name: string) => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onToggleComplete: () => void
    onOpenPriorityModal: () => void
    onOpenRescheduleModal: () => void
    onToggleMenu: () => void
    onStartEditing: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    onMoveToTop: () => void
    onMoveToBottom: () => void
    onDelete: () => void
    onSaveNotes: (notes: string) => void
    onSaveSteps: (steps: Step[]) => void
    onOpenEstimateModal: () => void
}
