import { Workspace } from "../../models/Workspace"
import { Project, Task } from "../../models"
import {
    getGlobalReminderTime,
    getGlobalReminderUpdatedAt,
    setGlobalReminderTime
} from "../storage/globalSettingsStorage"
import { loadWorkspaces, saveAccounts } from "../storage/accountStorage"
import { loadProjectsForWorkspace, saveProjectsForWorkspace } from "../storage/projectStorage"
import {apiClient} from "../../lib/apiClient";
import {ApiProject, ApiSettings, ApiTask, ApiWorkspace} from "../../models/syncService.types";

function mapApiTask(t: ApiTask): Task {
    return {
        id: t.id,
        name: t.name,
        completed: t.completed,
        priority: t.priority,
        date: t.date ?? null,
        notes: t.notes,
        estimatedMinutes: t.estimatedMinutes ?? undefined,
        steps: t.steps.map(s => ({ id: s.id, text: s.text, done: s.done })),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt ?? undefined,
    }
}

function mapApiProject(p: ApiProject): Project {
    return {
        id: p.id,
        name: p.name,
        color: p.color,
        reminderTime: p.reminderTime ?? undefined,
        tasks: p.tasks.map(mapApiTask),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt ?? undefined,
    }
}

export async function pushWorkspace(workspace: Workspace): Promise<void> {
    await apiClient.post('/workspaces', {
        id: workspace.id,
        name: workspace.name,
        dailyMinutes: workspace.dailyMinutes ?? null,
    }).catch(err => console.error('[SyncService] pushWorkspace failed:', err))
}

export function pushProject(workspaceId: string, project: Project): void {
    apiClient.post(`/workspaces/${workspaceId}/projects`, {
        id: project.id,
        name: project.name,
        color: project.color,
        reminderTime: project.reminderTime ?? null,
    }).then(async () => {
        for (const task of project.tasks) {
            await apiClient.post(`/projects/${project.id}/tasks`, {
                id: task.id,
                name: task.name,
                completed: task.completed,
                priority: task.priority,
                date: task.date ?? null,
                notes: task.notes,
                estimatedMinutes: task.estimatedMinutes ?? null,
                steps: task.steps ?? [],
            }).catch(err => console.error('[SyncService] pushProject task failed:', err))
        }
    }).catch(err => console.error('[SyncService] pushProject failed:', err))
}

export function deleteRemoteTask(taskId: string): void {
    apiClient.delete(`/tasks/${taskId}`)
        .catch(err => console.error('[SyncService] deleteRemoteTask failed:', err))
}

export function deleteRemoteProject(projectId: string): void {
    apiClient.delete(`/projects/${projectId}`)
        .catch(err => console.error('[SyncService] deleteRemoteProject failed:', err))
}

export function deleteRemoteWorkspace(workspaceId: string): void {
    apiClient.delete(`/workspaces/${workspaceId}`)
        .catch(err => console.error('[SyncService] deleteRemoteWorkspace failed:', err))
}

export async function syncGlobalSettings(): Promise<string | null | undefined> {
    try {
        const data: ApiSettings = await apiClient.get<ApiSettings | null>('/settings')

        if (!data) return undefined

        const localUpdatedAt: string = await getGlobalReminderUpdatedAt()
        const remoteUpdatedAt: string = data.updatedAt ?? ''

        if (!localUpdatedAt || remoteUpdatedAt > localUpdatedAt) {
            const remoteTime: string | null = data.globalReminderTime ?? null
            await setGlobalReminderTime(remoteTime)
            return remoteTime
        }

        return await getGlobalReminderTime()
    } catch (error) {
        console.error('[SyncService] syncGlobalSettings failed:', error)
        return undefined
    }
}

export async function syncWorkspaces(): Promise<Workspace[] | null> {
    try {
        const remoteWorkspaces: ApiWorkspace[] = await apiClient.get<ApiWorkspace[]>('/workspaces')

        const local: Workspace[] = await loadWorkspaces()
        const localMap = new Map(local.map((w: Workspace) => [w.id, w]))
        const remoteIds = new Set(remoteWorkspaces.map((w: ApiWorkspace) => w.id))
        const merged: Workspace[] = [...local]

        for (const row of remoteWorkspaces) {
            const remote: Workspace = {
                id: row.id,
                name: row.name,
                dailyMinutes: row.dailyMinutes ?? undefined,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt ?? undefined,
            }
            const existing: Workspace = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx: number = merged.findIndex((w: Workspace) => w.id === row.id)
                if (idx >= 0) merged[idx] = remote
                else merged.push(remote)
            }
        }

        for (const w of local) {
            if (!remoteIds.has(w.id)) {
                await pushWorkspace(w)
            }
        }

        await saveAccounts(merged)
        return merged
    } catch {
        return null
    }
}

export async function syncProjects(workspaceId: string): Promise<Project[] | null> {
    try {
        const remoteProjects: ApiProject[] = await apiClient.get<ApiProject[]>(`/workspaces/${workspaceId}/projects`)

        const local: Project[] = await loadProjectsForWorkspace(workspaceId)
        const localMap = new Map(local.map((p: Project) => [p.id, p]))
        const remoteProjectIds = new Set(remoteProjects.map((p: ApiProject) => p.id))
        const merged: Project[] = [...local]

        for (const row of remoteProjects) {
            const remote: Project = mapApiProject(row)
            const existing: Project = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx: number = merged.findIndex((p: Project) => p.id === row.id)
                if (idx >= 0)
                    merged[idx] = remote
                else
                    merged.push(remote)
            }
        }

        for (const p of local) {
            if (!remoteProjectIds.has(p.id)) {
                pushProject(workspaceId, p)
            } else {
                const remoteRow: ApiProject = remoteProjects.find((r: ApiProject) => r.id === p.id)
                if (remoteRow && (p.updatedAt ?? '') > (remoteRow.updatedAt ?? '')) {
                    pushProject(workspaceId, p)
                }
            }
        }

        await saveProjectsForWorkspace(workspaceId, merged)
        return merged
    } catch {
        return null
    }
}

export function pushGlobalSettings(reminderTime: string | null): void {
    apiClient.patch('/settings', {
        globalReminderTime: reminderTime,
    }).catch(err => console.error('[SyncService] pushGlobalSettings failed:', err))
}
