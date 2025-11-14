import {Priority, Task} from "@/app/utils/types";

export interface TaskModalProps {
    visible: boolean;
    onClose: () => void;

    unscheduledTasks: Task[];

    initialTab: 'new' | 'existing';
    defaultStartDate: string; // 'YYYY-MM-DD'
    defaultEndDate: string;   // 'YYYY-MM-DD'

    onCreateNew: (input: { name: string; priority: Priority; startDate: string; endDate: string }) => void;
    onScheduleExisting: (input: { taskId: string; startDate: string; endDate: string }) => void;
}
