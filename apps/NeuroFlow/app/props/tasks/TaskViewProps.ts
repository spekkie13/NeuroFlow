import {Project, Task, Routine} from "../../models";

export interface TaskViewProps {
    project: Project
    onAddTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onDeleteTask: (taskId: string) => void
    onMoveTask?: (taskId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void
    onAddRoutine: (routine: Routine) => void
    onUpdateRoutine: (routineId: string, updates: Partial<Routine>) => void
    onDeleteRoutine: (routineId: string) => void
}
