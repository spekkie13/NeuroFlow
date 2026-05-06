import { supabase } from '@/app/lib/supabase'
import { Workspace } from '@/app/models/Workspace'
import { Project } from '@/app/models/Project'
import { Task } from '@/app/models/Task'
import { loadWorkspaces, saveAccounts } from '@/app/services/storage/accountStorage'
import { loadProjectsForWorkspace, saveProjectsForWorkspace } from '@/app/services/storage/projectStorage'
import {
    getGlobalReminderTime,
    getGlobalReminderUpdatedAt,
    setGlobalReminderTime,
} from '@/app/services/storage/globalSettingsStorage'

// ── Fire-and-forget push helpers ─────────────────────────────────────────────

export function pushWorkspace(userId: string, workspace: Workspace): void {
    supabase.from('workspaces').upsert({
        id: workspace.id,
        user_id: userId,
        name: workspace.name,
        daily_minutes: workspace.dailyMinutes ?? null,
        created_at: workspace.createdAt,
        updated_at: workspace.updatedAt ?? workspace.createdAt,
    }).then(({ error }) => {
        if (error) console.error('[SyncService] pushWorkspace failed:', error.message)
    })
}

export function pushGlobalSettings(userId: string, reminderTime: string | null): void {
    supabase.from('user_settings').upsert({
        user_id: userId,
        global_reminder_time: reminderTime,
        updated_at: new Date().toISOString(),
    }).then(({ error }) => {
        if (error) console.error('[SyncService] pushGlobalSettings failed:', error.message)
    })
}

export function pushProject(userId: string, workspaceId: string, project: Project): void {
    supabase.from('projects').upsert({
        id: project.id,
        workspace_id: workspaceId,
        user_id: userId,
        name: project.name,
        color: project.color,
        reminder_time: project.reminderTime ?? null,
        created_at: project.createdAt ?? new Date().toISOString(),
        updated_at: project.updatedAt ?? new Date().toISOString(),
    }).then(() => {})

    if (project.tasks.length > 0) {
        supabase.from('tasks').upsert(
            project.tasks.map(t => ({
                id: t.id,
                project_id: project.id,
                user_id: userId,
                name: t.name,
                completed: t.completed,
                priority: t.priority,
                date: t.date ?? null,
                notes: t.notes,
                estimated_minutes: t.estimatedMinutes ?? null,
                steps: t.steps ?? [],
                created_at: t.createdAt ?? new Date().toISOString(),
                updated_at: t.updatedAt ?? new Date().toISOString(),
            }))
        ).then(() => {})
    }
}

export function deleteRemoteTask(taskId: string): void {
    supabase.from('tasks').delete().eq('id', taskId).then(() => {})
}

export function deleteRemoteProject(projectId: string): void {
    supabase.from('projects').delete().eq('id', projectId).then(() => {})
}

export function deleteRemoteWorkspace(workspaceId: string): void {
    supabase.from('workspaces').delete().eq('id', workspaceId).then(() => {})
}

// ── Startup sync (returns merged data, or null on failure) ───────────────────

export async function syncGlobalSettings(userId: string): Promise<string | null | undefined> {
    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('global_reminder_time, updated_at')
            .eq('user_id', userId)
            .maybeSingle()

        if (error || !data) return undefined

        const localUpdatedAt = await getGlobalReminderUpdatedAt()
        const remoteUpdatedAt = data.updated_at ?? ''

        if (!localUpdatedAt || remoteUpdatedAt > localUpdatedAt) {
            const remoteTime: string | null = data.global_reminder_time ?? null
            await setGlobalReminderTime(remoteTime)
            return remoteTime
        }

        return await getGlobalReminderTime()
    } catch {
        return undefined
    }
}

export async function syncWorkspaces(userId: string): Promise<Workspace[] | null> {
    try {
        const { data, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('user_id', userId)

        if (error || !data) return null

        const local = await loadWorkspaces()
        const localMap = new Map(local.map(w => [w.id, w]))
        const remoteIds = new Set(data.map(row => row.id))
        const merged = [...local]

        for (const row of data) {
            const remote: Workspace = {
                id: row.id,
                name: row.name,
                dailyMinutes: row.daily_minutes ?? undefined,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }
            const existing = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx = merged.findIndex(w => w.id === row.id)
                if (idx >= 0) merged[idx] = remote
                else merged.push(remote)
            }
        }

        // Push any local workspaces that never made it to the DB
        for (const w of local) {
            if (!remoteIds.has(w.id)) {
                pushWorkspace(userId, w)
            }
        }

        await saveAccounts(merged)
        return merged
    } catch {
        return null
    }
}

export async function syncProjects(userId: string, workspaceId: string): Promise<Project[] | null> {
    try {
        const [projRes, taskRes] = await Promise.all([
            supabase.from('projects').select('*').eq('workspace_id', workspaceId).eq('user_id', userId),
            supabase.from('tasks').select('*').eq('user_id', userId),
        ])

        if (projRes.error || taskRes.error) return null

        const remoteProjects = projRes.data ?? []
        const remoteTasks = taskRes.data ?? []
        const local = await loadProjectsForWorkspace(workspaceId)
        const localMap = new Map(local.map(p => [p.id, p]))
        const remoteProjectIds = new Set(remoteProjects.map(row => row.id))
        const merged = [...local]

        for (const row of remoteProjects) {
            const tasks: Task[] = remoteTasks
                .filter(t => t.project_id === row.id)
                .map(t => ({
                    id: t.id,
                    name: t.name,
                    completed: t.completed,
                    priority: t.priority,
                    date: t.date ?? null,
                    notes: t.notes,
                    estimatedMinutes: t.estimated_minutes ?? undefined,
                    steps: t.steps ?? [],
                    createdAt: t.created_at,
                    updatedAt: t.updated_at,
                }))

            const remote: Project = {
                id: row.id,
                name: row.name,
                color: row.color,
                reminderTime: row.reminder_time ?? undefined,
                tasks,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }

            const existing = localMap.get(row.id)
            if (!existing || (remote.updatedAt ?? '') > (existing.updatedAt ?? '')) {
                const idx = merged.findIndex(p => p.id === row.id)
                if (idx >= 0) merged[idx] = remote
                else merged.push(remote)
            }
        }

        // Push local projects that are missing from DB, or whose local version is newer
        for (const p of local) {
            if (!remoteProjectIds.has(p.id)) {
                pushProject(userId, workspaceId, p)
            } else {
                const remoteRow = remoteProjects.find(r => r.id === p.id)
                if (remoteRow && (p.updatedAt ?? '') > (remoteRow.updated_at ?? '')) {
                    pushProject(userId, workspaceId, p)
                }
            }
        }

        await saveProjectsForWorkspace(workspaceId, merged)
        return merged
    } catch {
        return null
    }
}