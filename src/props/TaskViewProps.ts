import {Project, Task} from "@/app/utils/types";

export interface TaskViewProps {
    project: Project;
    allProjects: Project[];
    onSelectProject: (id: string | null) => void;
    onAddProject?: (name: string, color: string) => void;
    onAddTask: (task: Task) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onAddToInbox?: (task: Task) => void;
    onDeleteProject?: (projectId: string) => void;
    onReorderTasks?: (orderedTasks: Task[]) => void;
}
