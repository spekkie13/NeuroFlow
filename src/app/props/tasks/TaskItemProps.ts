import { Task } from '@/app/models/Task'

export interface TaskItemProps {
    task: Task
    isEditing: boolean
    editName: string
    menuOpen: boolean
    canMoveUp: boolean
    canMoveDown: boolean
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
    onDelete: () => void
    onSaveNotes: (notes: string) => void
}