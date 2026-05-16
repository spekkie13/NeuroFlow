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
import {Project, Task} from "../models";
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
            setProjects(loaded)
            setIsLoading(false)

            if (userId) {
                await syncWorkspaces()

                syncProjects(workspaceId).then((merged: Project[]) => {
                    if (!mounted || !merged) return
                    setProjects(merged)
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
    }
}
