import { Task } from '../models'

export function sortTasksForColumn(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
        if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder
        if (a.sortOrder != null) return -1
        if (b.sortOrder != null) return 1
        return (a.createdAt ?? '') < (b.createdAt ?? '') ? -1 : 1
    })
}
