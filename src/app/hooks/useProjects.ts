import { useEffect, useState } from 'react'
import { loadProjectsForWorkspace, saveProjectsForWorkspace } from '../services/storage/projectStorage'
import {
    createProject,
    withTaskAdded,
    withTaskDeleted,
    withTaskUpdated,
    withUpdatedProjectName,
    withTaskMoved,
    TaskMoveDirection,
} from '../services/domain/ProjectService'
import { getNextProjectColor } from '../services/domain/ProjectColorService'
import { Project } from '@/app/models/Project'
import { Task } from '@/app/models/Task'
import {
    syncProjects,
    pushProject,
    deleteRemoteProject,
    deleteRemoteTask,
} from '@/app/services/sync/SyncService'

interface UseProjectsResult {
    projects: Project[]
    isLoading: boolean
    addProject: (name: string, color?: string) => Promise<void>
    updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>
    deleteProject: (projectId: string) => Promise<void>
    addTask: (projectId: string, task: Task) => Promise<void>
    updateTask: (
        projectId: string,
        taskId: string,
        updates: Partial<Task>,
    ) => Promise<void>
    deleteTask: (projectId: string, taskId: string) => Promise<void>
    moveTask: (
        projectId: string,
        taskId: string,
        direction: TaskMoveDirection,
    ) => Promise<void>
}

export function useProjects(workspaceId: string | null, userId: string | null): UseProjectsResult {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!workspaceId) {
            setProjects([])
            return
        }

        let mounted = true

        const init = async () => {
            setIsLoading(true)
            const loaded = await loadProjectsForWorkspace(workspaceId)
            if (!mounted) return
            setProjects(loaded)
            setIsLoading(false)

            // Background sync: fetch from Supabase and merge if we have a user
            if (userId) {
                syncProjects(userId, workspaceId).then((merged) => {
                    if (!mounted || !merged) return
                    setProjects(merged)
                })
            }
        }

        init()

        return () => {
            mounted = false
        }
    }, [workspaceId, userId])

    // Optimistic update: apply state immediately, then persist to storage.
    const persist = async (next: Project[]): Promise<void> => {
        if (!workspaceId) return
        setProjects(next)
        await saveProjectsForWorkspace(workspaceId, next)
    }

    const addProject = async (name: string, color?: string) => {
        const projectColor = color ?? getNextProjectColor(projects)
        const newProject = createProject({ name, color: projectColor })
        const next = [...projects, newProject]
        await persist(next)
        if (userId && workspaceId) pushProject(userId, workspaceId, newProject)
    }

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        const updatedAt = new Date().toISOString()
        const next = projects.map((p) => {
            if (p.id !== projectId) return p
            const merged = { ...p, ...updates, updatedAt }
            if (typeof updates.name === 'string') {
                return withUpdatedProjectName(merged, updates.name)
            }
            return merged
        })

        await persist(next)
        const updated = next.find((p) => p.id === projectId)
        if (userId && workspaceId && updated) pushProject(userId, workspaceId, updated)
    }

    const deleteProject = async (projectId: string) => {
        const next = projects.filter((p) => p.id !== projectId)
        await persist(next)
        if (userId) deleteRemoteProject(projectId)
    }

    const addTask = async (projectId: string, task: Task) => {
        const next = projects.map((p) =>
            p.id === projectId
                ? { ...withTaskAdded(p, task), updatedAt: new Date().toISOString() }
                : p,
        )
        await persist(next)
        const updated = next.find((p) => p.id === projectId)
        if (userId && workspaceId && updated) pushProject(userId, workspaceId, updated)
    }

    const updateTask = async (
        projectId: string,
        taskId: string,
        updates: Partial<Task>,
    ) => {
        const updatedAt = new Date().toISOString()
        const next = projects.map((p) =>
            p.id === projectId
                ? {
                    ...withTaskUpdated(p, taskId, { ...updates, updatedAt }),
                    updatedAt,
                }
                : p,
        )
        await persist(next)
        const updated = next.find((p) => p.id === projectId)
        if (userId && workspaceId && updated) pushProject(userId, workspaceId, updated)
    }

    const deleteTask = async (projectId: string, taskId: string) => {
        const next = projects.map((p) =>
            p.id === projectId
                ? { ...withTaskDeleted(p, taskId), updatedAt: new Date().toISOString() }
                : p,
        )
        await persist(next)
        if (userId) deleteRemoteTask(taskId)
        const updated = next.find((p) => p.id === projectId)
        if (userId && workspaceId && updated) pushProject(userId, workspaceId, updated)
    }

    const moveTask = async (
        projectId: string,
        taskId: string,
        direction: TaskMoveDirection,
    ) => {
        const updatedAt = new Date().toISOString()
        const next = projects.map((p) =>
            p.id === projectId
                ? { ...withTaskMoved(p, taskId, direction), updatedAt }
                : p,
        )
        await persist(next)
        const updated = next.find((p) => p.id === projectId)
        if (userId && workspaceId && updated) pushProject(userId, workspaceId, updated)
    }

    return {
        projects,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
    }
}