import {Priority, Task} from "@/app/utils/types";

export interface TaskItemProps {
    task: Task;
    isEditing: boolean;
    isMenuOpen: boolean;
    editValue: string;
    onStartEdit: () => void;
    onChangeEdit: (value: string) => void;
    onSaveEdit: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    onTogglePriorityMenu: () => void;
    onSetPriority: (priority: Priority) => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}
