import {Project, Task} from "../app/utils/types";

export interface TaskViewProps {
    project: Project;
    allProjects?: Project[];
    onSelectProject?: (projectId: string) => void;
    onAddProject?: (name: string, color: string) => void;
    onAddTask: (task: Task) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onAddToInbox?: (task: Task) => void;
}
