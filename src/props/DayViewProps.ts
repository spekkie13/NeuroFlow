import {Task} from "@/app/utils/types";

export interface DayViewProps {
    date: Date;
    tasks: Task[];
    projectColor: string;
    onToggleComplete: (taskId: string, completed: boolean) => void;
    onAddForDate: () => void;
}
