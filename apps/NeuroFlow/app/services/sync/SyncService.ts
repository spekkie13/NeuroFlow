import { Workspace } from "../../models/Workspace"
import { Project, Task } from "../../models"
import {Routine} from "../../models/Routine"
import {
    getGlobalReminderTime,
    getGlobalReminderUpdatedAt,
    setGlobalReminderTime
} from "../storage/globalSettingsStorage"
import { loadWorkspaces, saveAccounts } from "../storage/accountStorage"
import { loadProjectsForWorkspace, saveProjectsForWorkspace } from "../storage/projectStorage"
import {apiClient} from "../../lib/apiClient";
import {ApiProject, ApiRoutine, ApiSettings, ApiStep, ApiTask, ApiWorkspace} from "../../models/syncService.types";

function mapApiTask(t: ApiTask): Task {
    return {
        id: t.id,
        name: t.name,
        completed: t.completed,
        priority: t.priority,
        date: t.date ?? null,
        notes: t.notes,
        estimatedMinutes: t.estimatedMinutes ?? undefined,
        steps: t.steps.map((s: ApiStep) => ({ id: s.id, text: s.text, done: s.done })),
        routineId: t.routineId ?? undefined,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt ?? undefined,
    }
}

function mapApiRoutine(r: ApiRoutine): Routine {
    return {
        id: r.id,
        name: r.name,
        recurrence: r.recurrence,
        priority: r.priority,
        estimatedMinutes: r.estimatedMinutes ?? undefined,
        notes: r.notes ?? undefined,
        active: r.active,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
    }
}

function mapApiProject(p: ApiProject): Project {
    return {
        id: p.id,
        name: p.name,
        color: p.color,
        reminderTime: p.reminderTime ?? undefined,
        tasks: p.tasks.map(mapApiTask),
        routines: (p.routines ?? []).map(mapApiRoutine),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt ?? undefined,
    }
}

export async function pushWorkspace(workspace: Workspace): Promise<Workspace | null> {
    try {
        return await apiClient.post('/workspaces', {
            id: workspace.id,
            name: workspace.name,
            dailyMinutes: workspace.dailyMinutes ?? null,
            updatedAt: workspace.updatedAt,
        });
    } catch (err) {
        console.error('[SyncService] pushWorkspace failed:', err)
        return null;
    }
}

export async function pushProject(workspaceId: string, project: Project): Promise<Project | null> {
    try {
        await apiClient.post(`/workspaces/${workspaceId}/projects`, {
            id: project.id,
            name: project.name,
            color: project.color,
            reminderTime: project.reminderTime ?? null,
            routines: project.routines ?? [],
            updatedAt: project.updatedAt,
            tasks: project.tasks.map((task: Task) => ({
                id: task.id,
                name: task.name,
                completed: task.completed,
                priority: task.priority,
                date: task.date ?? null,
                notes: task.notes,
                estimatedMinutes: task.estimatedMinutes ?? null,
                routineId: task.routineId ?? null,
                steps: (task.steps ?? []).map(s => ({ id: s.id, text: s.text, done: s.done })),
            })),
        })
        return project
    } catch (err) {
        console.error('[SyncService] pushProject failed:', err)
        return null
    }
}

export async function deleteRemoteTask(taskId: string): Promise<boolean> {
    try {
        await apiClient.delete(`/tasks/${taskId}`);
        return true;
    } catch (err) {
        console.error('[SyncService] deleteRemoteTask failed:', err);
        return false;
    }
}

export async function deleteRemoteProject(projectId: string): Promise<boolean> {
    console.log('[SyncService] deleteRemoteProject projectId=', projectId)
    try {
        await apiClient.delete(`/projects/${projectId}`);
        console.log('[SyncService] deleteRemoteProject succeeded')
        return true;
    } catch (err) {
        console.error('[SyncService] deleteRemoteProject failed:', err instanceof Error ? err.message : err);
        return false;
    }
}

export async function deleteRemoteWorkspace(workspaceId: string): Promise<boolean> {
    try {
        await apiClient.delete(`/workspaces/${workspaceId}`)
        return true
    } catch (err) {
        console.error('[SyncService] deleteRemoteWorkspace failed:', err)
        return false
    }
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

        const merged: Workspace[] = []
        for (const row of remoteWorkspaces) {
            if (row.deletedAt) continue

            const existing: Workspace | undefined = localMap.get(row.id)
            const remote: Workspace = {
                id: row.id,
                name: row.name,
                dailyMinutes: row.dailyMinutes ?? undefined,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt ?? undefined,
            }
            merged.push((!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) ? remote : existing)
        }

        await saveAccounts(merged)
        return merged
    } catch (e) {
        console.error('[SyncService] syncWorkspaces failed:', e)
        return null
    }
}

export async function syncProjects(workspaceId: string): Promise<Project[] | null> {
    try {
        const remoteProjects: ApiProject[] = await apiClient.get<ApiProject[]>(`/workspaces/${workspaceId}/projects`)

        const local: Project[] = await loadProjectsForWorkspace(workspaceId)
        const localMap = new Map(local.map((p: Project) => [p.id, p]))
        const remoteProjectIds = new Set(remoteProjects.map((p: ApiProject) => p.id))
        let merged: Project[] = [...local]

        for (const row of remoteProjects) {
            if (row.deletedAt) {
                merged = merged.filter(p => p.id !== row.id)
                continue
            }

            const remote: Project = mapApiProject(row)
            const existing: Project = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx = merged.findIndex((p: Project) => p.id === row.id)
                if (idx >= 0) merged[idx] = remote
                else merged.push(remote)
            }
        }

        for (const p of local) {
            if (!remoteProjectIds.has(p.id)) {
                await pushProject(workspaceId, p)
            } else {
                const remoteRow: ApiProject = remoteProjects.find((r: ApiProject) => r.id === p.id)
                if (remoteRow && !remoteRow.deletedAt && (p.updatedAt ?? '') > (remoteRow.updatedAt ?? '')) {
                    await pushProject(workspaceId, p)
                }
            }
        }

        await saveProjectsForWorkspace(workspaceId, merged)
        return merged
    } catch (e) {
        console.error('[SyncService] syncProjects failed:', e)
        return null
    }
}

export async function pushGlobalSettings(reminderTime: string | null): Promise<boolean> {
    try {
        await apiClient.patch('/settings', {
            globalReminderTime: reminderTime,
        });
        return true;
    } catch (err) {
        console.error('[SyncService] pushGlobalSettings failed:', err)
        return false;
    }
}
