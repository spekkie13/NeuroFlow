import {Priority} from "../../models";

export interface PriorityModalProps {
    visible: boolean
    taskName?: string
    onSetPriority: (priority: Priority) => void
    onClose: () => void
}
