import {Priority, Project, Task} from "../../models";
import {generateId} from "../../utils/idUtils";
import {TaskMoveDirection} from "../../models/task/TaskMoveDirection";

export function createProject(params: { name: string; color: string; reminderTime?: string | null }): Project {
    const trimmed = params.name.trim()

    return {
        id: generateId(),
        name: trimmed || 'Untitled Project',
        color: params.color,
        reminderTime: params.reminderTime,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export function withUpdatedProjectName(project: Project, name: string): Project {
    const trimmed: string = name.trim()
    return {
        ...project,
        name: trimmed || 'Untitled Project',
    }
}

export function nextSortOrderForDate(project: Project, date: string): number {
    const orders = project.tasks
        .filter(t => t.date === date && t.sortOrder != null)
        .map(t => t.sortOrder!)
    return orders.length === 0 ? 0 : Math.max(...orders) + 1
}

export function compactSortOrderForDate(project: Project, date: string): Project {
    const sorted = project.tasks
        .filter(t => t.date === date)
        .sort((a, b) => {
            if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder
            if (a.sortOrder != null) return -1
            if (b.sortOrder != null) return 1
            return (a.createdAt ?? '') < (b.createdAt ?? '') ? -1 : 1
        })

    const orderById = new Map<string, number>()
    sorted.forEach((t, i) => orderById.set(t.id, i))

    return {
        ...project,
        tasks: project.tasks.map(t =>
            t.date === date ? { ...t, sortOrder: orderById.get(t.id) } : t
        ),
    }
}

export function withTasksReordered(project: Project, reorderedTasks: Task[]): Project {
    const orderById = new Map<string, number>()
    reorderedTasks.forEach((t, i) => orderById.set(t.id, i))
    return {
        ...project,
        tasks: project.tasks.map(t =>
            orderById.has(t.id) ? { ...t, sortOrder: orderById.get(t.id) } : t
        ),
    }
}

export function withTaskAdded(project: Project, task: Task): Project {
    const taskWithOrder = task.date
        ? { ...task, sortOrder: nextSortOrderForDate(project, task.date) }
        : task
    return {
        ...project,
        tasks: [...project.tasks, taskWithOrder],
    }
}

export function withTaskUpdated(
    project: Project,
    taskId: string,
    updates: Partial<Task>,
): Project {
    const existing = project.tasks.find(t => t.id === taskId)

    let updated: Project = {
        ...project,
        tasks: project.tasks.map((t: Task) =>
            t.id === taskId ? { ...t, ...updates } : t,
        ),
    }

    const dateChanging = updates.date !== undefined && updates.date !== existing?.date

    if (dateChanging && existing) {
        if (updates.date) {
            const newSortOrder = nextSortOrderForDate(project, updates.date)
            updated = {
                ...updated,
                tasks: updated.tasks.map(t =>
                    t.id === taskId ? { ...t, sortOrder: newSortOrder } : t
                ),
            }
        } else {
            updated = {
                ...updated,
                tasks: updated.tasks.map(t =>
                    t.id === taskId ? { ...t, sortOrder: undefined } : t
                ),
            }
        }

        if (existing.date) {
            updated = compactSortOrderForDate(updated, existing.date)
        }
    }

    return updated
}

export function withTaskDeleted(project: Project, taskId: string): Project {
    const task = project.tasks.find(t => t.id === taskId)
    const withoutTask: Project = {
        ...project,
        tasks: project.tasks.filter((t: Task) => t.id !== taskId),
    }
    return task?.date ? compactSortOrderForDate(withoutTask, task.date) : withoutTask
}

export function withTaskMoved(
    project: Project,
    taskId: string,
    direction: TaskMoveDirection,
): Project {
    const idx: number = project.tasks.findIndex((t: Task) => t.id === taskId)
    if (idx < 0) return project

    const task: Task = project.tasks[idx]
    const priority: Priority = task.priority

    let targetIndex: number = idx

    if (direction === 'up') {
        for (let i = idx - 1; i >= 0; i--) {
            if (project.tasks[i].priority === priority) {
                targetIndex = i
                break
            }
        }
    } else if (direction === 'down') {
        for (let i = idx + 1; i < project.tasks.length; i++) {
            if (project.tasks[i].priority === priority) {
                targetIndex = i
                break
            }
        }
    } else if (direction === 'top') {
        for (let i = 0; i < idx; i++) {
            if (project.tasks[i].priority === priority) {
                targetIndex = i
                break
            }
        }
    } else if (direction === 'bottom') {
        for (let i = project.tasks.length - 1; i > idx; i--) {
            if (project.tasks[i].priority === priority) {
                targetIndex = i
                break
            }
        }
    }

    if (targetIndex === idx) {
        return project
    }

    const newTasks: Task[] = [...project.tasks]
    const [removed] = newTasks.splice(idx, 1)
    newTasks.splice(targetIndex, 0, removed)

    return {
        ...project,
        tasks: newTasks,
    }
}
