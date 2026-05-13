import { getJsonItem, setJsonItem } from './baseStorage'
import { Project } from "../../models";

const PROJECTS_KEY_PREFIX = 'adhd-planner:projects'

function keyForWorkspace(workspaceId: string): string {
    return `${PROJECTS_KEY_PREFIX}:${workspaceId}`
}

export async function loadProjectsForWorkspace(workspaceId: string): Promise<Project[]> {
    const stored = await getJsonItem<Project[]>(keyForWorkspace(workspaceId))
    return stored ?? []
}

export async function saveProjectsForWorkspace(workspaceId: string, projects: Project[]): Promise<void> {
    await setJsonItem(keyForWorkspace(workspaceId), projects)
}
