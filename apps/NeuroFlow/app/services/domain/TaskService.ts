import {Priority, Task} from "../../models"
import {generateId} from "../../utils/idUtils";
import {startOfDay} from "date-fns";

export function createTask(params: {
    name: string
    priority?: Priority
    date?: string | null
    notes?: string
}): Task {
    const {
        name,
        priority = 'medium',
        date = null,
        notes = '',
    } = params

    const trimmed : string = name.trim()

    return {
        id: generateId(),
        name: trimmed || 'Untitled Task',
        completed: false,
        priority,
        date,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export function isTaskScheduled(task: Task): boolean {
    return Boolean(task.date)
}

export function doesTaskCoverDate(task: Task, date: Date): boolean {
    if (!task.date)
        return false

    const target = new Date(date.toISOString().split('T')[0])
    const start = new Date(new Date(task.date).toISOString().split('T')[0])

    return target.getTime() === start.getTime()
}

/**
 * Returns true if the task has a past due date and is not yet completed.
 * Completed tasks are never considered overdue.
 */
export function isOverdue(task: Task): boolean {
    if (!task.date || task.completed)
        return false
    
    return startOfDay(new Date(task.date)) < startOfDay(new Date())
}
