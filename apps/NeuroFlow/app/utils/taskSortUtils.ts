import { Task } from '../models'

export type SortMode = 'created' | 'due'

export function sortTasks(tasks: Task[], mode: SortMode): Task[] {
    if (mode === 'created') return [...tasks]
    return [...tasks].sort((a, b) => {
        if (!a.date && !b.date) return 0
        if (!a.date) return 1
        if (!b.date) return -1
        return a.date < b.date ? -1 : 1
    })
}

export function sortTasksForColumn(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) =>
        (a.createdAt ?? '') < (b.createdAt ?? '') ? -1 : 1
    )
}
