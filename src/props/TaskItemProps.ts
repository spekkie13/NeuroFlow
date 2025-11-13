import {Priority, Task} from "@/app/utils/types";

export interface TaskItemProps {
    task: Task;
    isEditing: boolean;
    isMenuOpen: boolean;
    editValue: string;
    onStartEdit: () => void;
    onChangeEdit: (text: string) => void;
    onSaveEdit: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    onTogglePriorityMenu: () => void;
    onSetPriority: (priority: Priority) => void;
}
