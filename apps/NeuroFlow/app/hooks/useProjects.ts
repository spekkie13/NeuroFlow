import { useEffect, useState } from 'react'
import { loadProjectsForWorkspace, saveProjectsForWorkspace } from '../services/storage/projectStorage'
import {
    createProject,
    withTaskAdded,
    withTaskDeleted,
    withTaskUpdated,
    withUpdatedProjectName,
    withTaskMoved,
} from '../services/domain/ProjectService'
import { getNextProjectColor } from '../services/domain/ProjectColorService'
import {
    cleanupOldInstances,
    generateRoutineInstances,
} from '../services/domain/RoutineService'
import {Project, Task, Routine} from "../models";
import {
    deleteRemoteProject,
    deleteRemoteTask,
    pushProject,
    syncProjects,
    syncWorkspaces
} from "../services/sync/SyncService";
import {UseProjectsResult} from "../models/hooks/UseProjectsResult";
import {TaskMoveDirection} from "../models/task/TaskMoveDirection";

export function useProjects(workspaceId: string | null, userId: string | null): UseProjectsResult {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [syncError, setSyncError] = useState<string | null>(null)

    useEffect(() => {
        if (!workspaceId) {
            setProjects([])
            return
        }

        let mounted: boolean = true

        const init = async () => {
            setIsLoading(true)
            const loaded: Project[] = await loadProjectsForWorkspace(workspaceId)
            if (!mounted) return

            const today = new Date()
            const withInstances = generateRoutineInstances(cleanupOldInstances(loaded), today)
            const didGenerate = withInstances.some((p, i) => p !== loaded[i])
            if (didGenerate) await saveProjectsForWorkspace(workspaceId, withInstances)
            setProjects(withInstances)
            setIsLoading(false)

            if (userId) {
                await syncWorkspaces()

                syncProjects(workspaceId).then((merged: Project[]) => {
                    if (!mounted || !merged) return
                    const withSyncedInstances = generateRoutineInstances(
                        cleanupOldInstances(merged),
                        today,
                    )
                    const syncedDidGenerate = withSyncedInstances.some((p, i) => p !== merged[i])
                    if (syncedDidGenerate) saveProjectsForWorkspace(workspaceId, withSyncedInstances)
                    setProjects(withSyncedInstances)
                })
            }
        }

        init()

        return () => { mounted = false }
    }, [workspaceId, userId])

    const persist = async (next: Project[]): Promise<void> => {
        if (!workspaceId) return
        setProjects(next)
        await saveProjectsForWorkspace(workspaceId, next)
    }

    const addProject = async (name: string, color?: string, reminderTime?: string | null) => {
        const projectColor: string = color ?? getNextProjectColor(projects)
        const newProject: Project = createProject({ name, color: projectColor, reminderTime })
        const next: Project[] = [...projects, newProject]
        await persist(next)
        if (userId && workspaceId) {
            const synced: Project | null = await pushProject(workspaceId, newProject)
            if (!synced)
                setSyncError(`Project "${newProject.name}" couldn't be synced. It's saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        const updatedAt: string = new Date().toISOString()
        const next: Project[] = projects.map((p: Project) => {
            if (p.id !== projectId) return p
            const merged = { ...p, ...updates, updatedAt }
            if (typeof updates.name === 'string') {
                return withUpdatedProjectName(merged, updates.name)
            }
            return merged
        })

        await persist(next)
        const updated: Project = next.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Changes for project "${updated.name}" couldn't be synced. They're saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const deleteProject = async (projectId: string) => {
        const target: Project = projects.find((p: Project) => p.id === projectId)
        const next: Project[] = projects.filter((p: Project) => p.id !== projectId)
        await persist(next)
        if (userId) {
            const deleted: boolean = await deleteRemoteProject(projectId)
            if (!deleted)
                setSyncError(`Project "${target?.name}" couldn't be deleted from the server. It's removed on this device.`)
            else
                setSyncError(null)
        }
    }

    const addTask = async (projectId: string, task: Task) => {
        const next: Project[] = projects.map((p: Project) =>
            p.id === projectId
                ? { ...withTaskAdded(p, task), updatedAt: new Date().toISOString() }
                : p,
        )
        await persist(next)
        const updated: Project = next.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Task "${task.name}" couldn't be synced to project "${updated.name}". It's saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const updateTask = async (projectId: string, taskId: string, updates: Partial<Task>) => {
        const updatedAt: string = new Date().toISOString()
        const next: Project[] = projects.map((p: Project) =>
            p.id === projectId
                ? { ...withTaskUpdated(p, taskId, { ...updates, updatedAt }), updatedAt }
                : p,
        )
        await persist(next)
        const updated: Project = next.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Changes in project "${updated.name}" couldn't be synced. They're saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const deleteTask = async (projectId: string, taskId: string) => {
        const project: Project = projects.find((p: Project) => p.id === projectId)
        const task: Task = project?.tasks.find((t: Task) => t.id === taskId)
        const next: Project[] = projects.map((p: Project) =>
            p.id === projectId
                ? { ...withTaskDeleted(p, taskId), updatedAt: new Date().toISOString() }
                : p,
        )
        await persist(next)

        const updated: Project = next.find((p: Project) => p.id === projectId)

        if (userId) {
            const deleted: boolean = await deleteRemoteTask(taskId)
            const synced: Project | null = workspaceId && updated
                ? await pushProject(workspaceId, updated)
                : null

            if (!deleted && !synced)
                setSyncError(`Task "${task?.name}" couldn't be deleted and project "${updated?.name}" couldn't be synced. Changes are saved on this device.`)
            else if (!deleted)
                setSyncError(`Task "${task?.name}" couldn't be deleted from the server. It's removed on this device.`)
            else if (!synced)
                setSyncError(`Task "${task?.name}" was deleted but project "${updated?.name}" couldn't be synced.`)
            else
                setSyncError(null)
        }
    }

    const moveTask = async (projectId: string, taskId: string, direction: TaskMoveDirection) => {
        const updatedAt: string = new Date().toISOString()
        const next: Project[] = projects.map((p: Project) =>
            p.id === projectId
                ? { ...withTaskMoved(p, taskId, direction), updatedAt }
                : p,
        )
        await persist(next)
        const updated: Project = next.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Task order in project "${updated.name}" couldn't be synced. It's saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const addRoutine = async (projectId: string, routine: Routine) => {
        const today = new Date()
        const next: Project[] = projects.map((p: Project) => {
            if (p.id !== projectId) return p
            return { ...p, routines: [...(p.routines ?? []), routine], updatedAt: new Date().toISOString() }
        })
        const withInstances = generateRoutineInstances(next, today)
        await persist(withInstances)
        const updated: Project = withInstances.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Routine "${routine.name}" couldn't be synced. It's saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const updateRoutine = async (projectId: string, routineId: string, updates: Partial<Routine>) => {
        const today = new Date()
        const next: Project[] = projects.map((p: Project) => {
            if (p.id !== projectId) return p

            const updatedRoutines = (p.routines ?? []).map(r =>
                r.id === routineId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
            )

            // When deactivating, remove all pending (non-completed) instances for this routine
            // so they immediately disappear from the timeline and today view.
            const tasks = updates.active === false
                ? p.tasks.filter(t => !(t.routineId === routineId && !t.completed))
                : p.tasks

            return { ...p, routines: updatedRoutines, tasks, updatedAt: new Date().toISOString() }
        })
        const withInstances = generateRoutineInstances(next, today)
        await persist(withInstances)
        const updated: Project = withInstances.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Routine changes couldn't be synced. They're saved on this device.`)
            else
                setSyncError(null)
        }
    }

    const deleteRoutine = async (projectId: string, routineId: string) => {
        const next: Project[] = projects.map((p: Project) => {
            if (p.id !== projectId) return p
            return {
                ...p,
                routines: (p.routines ?? []).filter(r => r.id !== routineId),
                updatedAt: new Date().toISOString(),
            }
        })
        await persist(next)
        const updated: Project = next.find((p: Project) => p.id === projectId)
        if (userId && workspaceId && updated) {
            const synced: Project | null = await pushProject(workspaceId, updated)
            if (!synced)
                setSyncError(`Routine couldn't be deleted from the server. It's removed on this device.`)
            else
                setSyncError(null)
        }
    }

    return {
        projects,
        isLoading,
        syncError,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addRoutine,
        updateRoutine,
        deleteRoutine,
    }
}
