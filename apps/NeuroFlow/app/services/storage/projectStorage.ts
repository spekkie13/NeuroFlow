import { getJsonItem, setJsonItem } from './baseStorage'
import { Project } from "../../models";
import { transferTask } from '../domain/ProjectService'

const PROJECTS_KEY_PREFIX = 'adhd-planner:projects'

function keyForWorkspace(workspaceId: string): string {
    return `${PROJECTS_KEY_PREFIX}:${workspaceId}`
}

export async function loadProjectsForWorkspace(workspaceId: string): Promise<Project[]> {
    const stored: Project[] = await getJsonItem<Project[]>(keyForWorkspace(workspaceId))
    return stored ?? []
}

export async function saveProjectsForWorkspace(workspaceId: string, projects: Project[]): Promise<void> {
    await setJsonItem(keyForWorkspace(workspaceId), projects)
}

export async function transferProjectBetweenWorkspaces(
    sourceWorkspaceId: string,
    projectId: string,
    targetWorkspaceId: string,
): Promise<Project | null> {
    const sourceProjects = await loadProjectsForWorkspace(sourceWorkspaceId)
    const project = sourceProjects.find(p => p.id === projectId)
    if (!project) return null

    const targetProjects = await loadProjectsForWorkspace(targetWorkspaceId)
    await saveProjectsForWorkspace(sourceWorkspaceId, sourceProjects.filter(p => p.id !== projectId))
    await saveProjectsForWorkspace(targetWorkspaceId, [...targetProjects, project])
    return project
}

export async function transferTaskBetweenWorkspaces(
    sourceWorkspaceId: string,
    sourceProjectId: string,
    taskId: string,
    targetWorkspaceId: string,
    targetProjectId: string,
): Promise<{ updatedSource: Project; updatedTarget: Project } | null> {
    const sourceProjects = await loadProjectsForWorkspace(sourceWorkspaceId)
    const targetProjects = await loadProjectsForWorkspace(targetWorkspaceId)
    const source = sourceProjects.find(p => p.id === sourceProjectId)
    const target = targetProjects.find(p => p.id === targetProjectId)
    if (!source || !target) return null

    const [updatedSource, updatedTarget] = transferTask(source, target, taskId)
    await saveProjectsForWorkspace(
        sourceWorkspaceId,
        sourceProjects.map(p => p.id === sourceProjectId ? updatedSource : p),
    )
    await saveProjectsForWorkspace(
        targetWorkspaceId,
        targetProjects.map(p => p.id === targetProjectId ? updatedTarget : p),
    )
    return { updatedSource, updatedTarget }
}
