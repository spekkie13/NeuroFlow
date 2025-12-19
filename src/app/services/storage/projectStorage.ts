import { getJsonItem, setJsonItem } from './baseStorage'
import { Project } from "@/app/models/Project";

const PROJECTS_KEY_PREFIX = 'adhd-planner:projects:local'

function keyForAccount(): string {
    return `${PROJECTS_KEY_PREFIX}`
}

export async function loadProjectsForAccount(): Promise<Project[]> {
    const stored = await getJsonItem<Project[]>(keyForAccount())
    return stored ?? []
}

export async function saveProjectsForAccount(projects: Project[]): Promise<void> {
    await setJsonItem(keyForAccount(), projects)
}
