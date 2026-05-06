import { Project } from "@/app/models/Project";
import { Task } from "@/app/models/Task";
import { generateId } from '@/app/utils/idUtils'

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
    const trimmed = name.trim()
    return {
        ...project,
        name: trimmed || 'Untitled Project',
    }
}

export function withTaskAdded(project: Project, task: Task): Project {
    return {
        ...project,
        tasks: [...project.tasks, task],
    }
}

export function withTaskUpdated(
    project: Project,
    taskId: string,
    updates: Partial<Task>,
): Project {
    return {
        ...project,
        tasks: project.tasks.map((t) =>
            t.id === taskId
                ? {
                    ...t,
                    ...updates,
                }
                : t,
        ),
    }
}

export function withTaskDeleted(project: Project, taskId: string): Project {
    return {
        ...project,
        tasks: project.tasks.filter((t) => t.id !== taskId),
    }
}

export type TaskMoveDirection = 'up' | 'down' | 'top' | 'bottom'

export function withTaskMoved(
    project: Project,
    taskId: string,
    direction: TaskMoveDirection,
): Project {
    const idx = project.tasks.findIndex((t) => t.id === taskId)
    if (idx < 0) return project

    const task = project.tasks[idx]
    const priority = task.priority

    let targetIndex = idx

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

    const newTasks = [...project.tasks]
    const [removed] = newTasks.splice(idx, 1)
    newTasks.splice(targetIndex, 0, removed)

    return {
        ...project,
        tasks: newTasks,
    }
}
