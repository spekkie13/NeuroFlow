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
import { Project } from "@/app/models/Project";
import { Task } from "@/app/models/Task";

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

export function useProjects(workspaceId: string | null): UseProjectsResult {
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
        }

        init()

        return () => {
            mounted = false
        }
    }, [workspaceId])

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
    }

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        const next = projects.map((p) => {
            if (p.id !== projectId) return p
            const merged = { ...p, ...updates }
            if (typeof updates.name === 'string') {
                return withUpdatedProjectName(merged, updates.name)
            }
            return merged
        })

        await persist(next)
    }

    const deleteProject = async (projectId: string) => {
        const next = projects.filter((p) => p.id !== projectId)
        await persist(next)
    }

    const addTask = async (projectId: string, task: Task) => {
        const next = projects.map((p) =>
            p.id === projectId ? withTaskAdded(p, task) : p,
        )
        await persist(next)
    }

    const updateTask = async (
        projectId: string,
        taskId: string,
        updates: Partial<Task>,
    ) => {
        const next = projects.map((p) =>
            p.id === projectId ? withTaskUpdated(p, taskId, updates) : p,
        )
        await persist(next)
    }

    const deleteTask = async (projectId: string, taskId: string) => {
        const next = projects.map((p) =>
            p.id === projectId ? withTaskDeleted(p, taskId) : p,
        )
        await persist(next)
    }

    const moveTask = async (
        projectId: string,
        taskId: string,
        direction: TaskMoveDirection,
    ) => {
        const next = projects.map((p) =>
            p.id === projectId ? withTaskMoved(p, taskId, direction) : p,
        )
        await persist(next)
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
