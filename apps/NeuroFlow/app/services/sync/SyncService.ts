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

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiWorkspace {
    id: string
    userId: string
    name: string
    dailyMinutes: number | null
    createdAt: string
    updatedAt: string | null
}

interface ApiStep {
    id: string
    taskId: string
    text: string
    done: boolean
}

interface ApiTask {
    id: string
    projectId: string
    name: string
    completed: boolean
    priority: 'high' | 'medium' | 'low'
    date: string | null
    notes: string
    estimatedMinutes: number | null
    steps: ApiStep[]
    createdAt: string
    updatedAt: string | null
}

interface ApiProject {
    id: string
    workspaceId: string
    name: string
    color: string
    reminderTime: string | null
    tasks: ApiTask[]
    createdAt: string
    updatedAt: string | null
}

interface ApiSettings {
    userId: string
    globalReminderTime: string | null
    updatedAt: string | null
}

// ── Mappers ───────────────────────────────────────────────────────────────────

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

// ── Push helpers ──────────────────────────────────────────────────────────────

export function pushWorkspace(workspace: Workspace): void {
    apiClient.post('/workspaces', {
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
    }).catch(err => console.error('[SyncService] pushProject failed:', err))

    for (const task of project.tasks) {
        apiClient.post(`/projects/${project.id}/tasks`, {
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

// ── Startup sync ──────────────────────────────────────────────────────────────

export async function syncGlobalSettings(): Promise<string | null | undefined> {
    try {
        const data = await apiClient.get<ApiSettings | null>('/settings')

        if (!data) return undefined

        const localUpdatedAt = await getGlobalReminderUpdatedAt()
        const remoteUpdatedAt = data.updatedAt ?? ''

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
        const remoteWorkspaces = await apiClient.get<ApiWorkspace[]>('/workspaces')

        const local = await loadWorkspaces()
        const localMap = new Map(local.map(w => [w.id, w]))
        const remoteIds = new Set(remoteWorkspaces.map(w => w.id))
        const merged = [...local]

        for (const row of remoteWorkspaces) {
            const remote: Workspace = {
                id: row.id,
                name: row.name,
                dailyMinutes: row.dailyMinutes ?? undefined,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt ?? undefined,
            }
            const existing = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx = merged.findIndex(w => w.id === row.id)
                if (idx >= 0) merged[idx] = remote
                else merged.push(remote)
            }
        }

        for (const w of local) {
            if (!remoteIds.has(w.id)) {
                pushWorkspace(w)
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
        const remoteProjects = await apiClient.get<ApiProject[]>(`/workspaces/${workspaceId}/projects`)

        const local = await loadProjectsForWorkspace(workspaceId)
        const localMap = new Map(local.map(p => [p.id, p]))
        const remoteProjectIds = new Set(remoteProjects.map(p => p.id))
        const merged = [...local]

        for (const row of remoteProjects) {
            const remote = mapApiProject(row)
            const existing = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx = merged.findIndex(p => p.id === row.id)
                if (idx >= 0) merged[idx] = remote
                else merged.push(remote)
            }
        }

        for (const p of local) {
            if (!remoteProjectIds.has(p.id)) {
                pushProject(workspaceId, p)
            } else {
                const remoteRow = remoteProjects.find(r => r.id === p.id)
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
