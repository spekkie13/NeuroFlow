import {Priority, Task} from "@/app/utils/types";

export interface TaskListProps {
    tasks: Task[];
    editingTaskId: string | null;
    showPriorityMenu: string | null;
    onScrollCloseMenu: () => void;
    onStartEdit: (task: Task) => void;
    onChangeEdit: (value: string) => void;
    editValue: string;
    onSaveEdit: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string, completed: boolean) => void;
    onTogglePriorityMenu: (taskId: string) => void;
    onSetPriority: (taskId: string, priority: Priority) => void;
}
