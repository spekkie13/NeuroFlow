// services/storage/projectStorage.ts
import { Project } from '@/app/utils/types'
import { getJsonItem, setJsonItem } from './baseStorage'

const PROJECTS_KEY_PREFIX = 'adhd-planner:projects:'

function keyForAccount(accountId: string): string {
    return `${PROJECTS_KEY_PREFIX}${accountId}`
}

export async function loadProjectsForAccount(accountId: string): Promise<Project[]> {
    const stored = await getJsonItem<Project[]>(keyForAccount(accountId))
    return stored ?? []
}

export async function saveProjectsForAccount(
    accountId: string,
    projects: Project[],
): Promise<void> {
    await setJsonItem(keyForAccount(accountId), projects)
}
