import { useEffect, useState } from 'react'
import { Project, Task } from '../models'
import { Workspace } from '../models/Workspace'
import { loadProjectsForWorkspace, saveProjectsForWorkspace } from '../services/storage/projectStorage'
import { pushProject, syncProjects } from '../services/sync/SyncService'
import { withTaskUpdated } from '../services/domain/ProjectService'
import { cleanupOldInstances, generateRoutineInstances } from '../services/domain/RoutineService'

export interface ProjectWithWorkspace {
    project: Project
    workspaceId: string
    workspaceName: string
}

interface UseAllWorkspacesProjectsResult {
    allProjects: ProjectWithWorkspace[]
    isLoading: boolean
    updateTask: (workspaceId: string, projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>
}

export function useAllWorkspacesProjects(
    workspaces: Workspace[],
    userId: string | null,
    enabled: boolean,
): UseAllWorkspacesProjectsResult {
    const [projectsByWorkspace, setProjectsByWorkspace] = useState<Record<string, Project[]>>({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!enabled || workspaces.length === 0) {
            setProjectsByWorkspace({})
            setIsLoading(false)
            return
        }

        let mounted = true
        setIsLoading(true)

        const load = async () => {
            const today = new Date()
            const initial: Record<string, Project[]> = {}

            await Promise.all(
                workspaces.map(async (ws) => {
                    const loaded = await loadProjectsForWorkspace(ws.id)
                    const withInstances = generateRoutineInstances(cleanupOldInstances(loaded), today)
                    initial[ws.id] = withInstances
                })
            )

            if (!mounted) return
            setProjectsByWorkspace(initial)
            setIsLoading(false)

            if (userId) {
                await Promise.all(
                    workspaces.map(async (ws) => {
                        const merged = await syncProjects(ws.id)
                        if (!mounted || !merged) return
                        const withInstances = generateRoutineInstances(cleanupOldInstances(merged), today)
                        setProjectsByWorkspace(prev => ({ ...prev, [ws.id]: withInstances }))
                    })
                )
            }
        }

        load()
        return () => { mounted = false }
    }, [enabled, workspaces, userId])

    const allProjects: ProjectWithWorkspace[] = workspaces.flatMap(ws =>
        (projectsByWorkspace[ws.id] ?? []).map(project => ({
            project,
            workspaceId: ws.id,
            workspaceName: ws.name,
        }))
    )

    const updateTask = async (
        workspaceId: string,
        projectId: string,
        taskId: string,
        updates: Partial<Task>,
    ): Promise<void> => {
        const wsProjects = projectsByWorkspace[workspaceId] ?? []
        const project = wsProjects.find(p => p.id === projectId)
        if (!project) return

        const updatedProject = withTaskUpdated(project, taskId, updates)
        const updatedProjects = wsProjects.map(p => p.id === projectId ? updatedProject : p)

        setProjectsByWorkspace(prev => ({ ...prev, [workspaceId]: updatedProjects }))
        await saveProjectsForWorkspace(workspaceId, updatedProjects)
        if (userId) pushProject(workspaceId, updatedProject)
    }

    return { allProjects, isLoading, updateTask }
}
