import { Task } from '@/app/models/Task'

export interface ScheduleTaskModalProps {
    visible: boolean
    selectedDate: Date | null
    selectableExistingTasks: Task[]
    onAddNewTask: (task: Task) => void
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onClose: () => void
}