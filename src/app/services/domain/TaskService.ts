import { Priority } from "@/app/models/Priority";
import { Task } from "@/app/models/Task";

function generateId(): string {
    return Date.now().toString()
}

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

    const trimmed = name.trim()

    return {
        id: generateId(),
        name: trimmed || 'Untitled Task',
        completed: false,
        priority,
        date,
        notes,
    }
}

export function createTaskFromName(name: string): Task {
    return createTask({ name })
}

export function toggleTaskCompleted(task: Task): Task {
    return {
        ...task,
        completed: !task.completed,
    }
}

export function withUpdatedName(task: Task, name: string): Task {
    const trimmed = name.trim()
    return {
        ...task,
        name: trimmed || 'Untitled Task',
    }
}

export function withPriority(task: Task, priority: Priority): Task {
    return {
        ...task,
        priority,
    }
}

export function isTaskScheduled(task: Task): boolean {
    return Boolean(task.date)
}

export function doesTaskCoverDate(task: Task, date: Date): boolean {
    if (!task.date) return false

    const target = new Date(date.toISOString().split('T')[0])
    const start = new Date(new Date(task.date).toISOString().split('T')[0])

    return target.getTime() === start.getTime()
}
