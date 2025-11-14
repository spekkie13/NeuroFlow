import {Project, Task} from "@/app/utils/types";

export interface TimelineProps {
    project: Project;
    onAddTask: (task: Task) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}
