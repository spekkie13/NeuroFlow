import { Task } from '../models'

export function sortTasksForColumn(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) =>
        (a.createdAt ?? '') < (b.createdAt ?? '') ? -1 : 1
    )
}
