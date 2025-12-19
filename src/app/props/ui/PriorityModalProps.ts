import {Priority} from "@/app/models/Priority";

export interface PriorityModalProps {
    visible: boolean
    taskName?: string
    onSetPriority: (priority: Priority) => void
    onClose: () => void
}
