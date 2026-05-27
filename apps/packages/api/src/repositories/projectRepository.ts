import {Project, ProjectInsert, ProjectUpdate} from "../types/db.types";
import {db} from "../db/index.js";
import {projects, steps, tasks} from "../db/schema.js";
import {and, eq, inArray} from "drizzle-orm";

export class ProjectRepository {
    async getProjectsForWorkspace(userId: string, workspaceId: string) {
        const projectList = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.userId, userId),
                    eq(projects.workspaceId, workspaceId)
                )
            )

        const activeProjectIds = projectList
            .filter(p => !p.deletedAt)
            .map(p => p.id)

        const rows = activeProjectIds.length > 0
            ? await db
                .select()
                .from(tasks)
                .leftJoin(steps, eq(steps.taskId, tasks.id))
                .where(
                    and(
                        eq(tasks.userId, userId),
                        inArray(tasks.projectId, activeProjectIds)
                    )
                )
            : []

        const stepsByTask = rows.reduce((acc, row) => {
            if (!acc[row.tasks.id]) {
                acc[row.tasks.id] = { ...row.tasks, steps: [] }
            }
            if (row.steps) {
                acc[row.tasks.id].steps.push(row.steps)
            }
            return acc
        }, {} as Record<string, any>)

        const tasksByProject = Object.values(stepsByTask).reduce((acc, task) => {
            if (!acc[task.projectId]) acc[task.projectId] = []
            acc[task.projectId].push(task)
            return acc
        }, {} as Record<string, any>)

        return projectList.map(project => ({
            ...project,
            tasks: tasksByProject[project.id] ?? []
        }))
    }

    async createProject(projectData: ProjectInsert): Promise<Project> {
        const [project] = await db
            .insert(projects)
            .values(projectData)
            .onConflictDoUpdate({
                target: projects.id,
                set: { name: projectData.name, color: projectData.color, reminderTime: projectData.reminderTime, routines: projectData.routines, updatedAt: projectData.updatedAt },
            })
            .returning()

        return project;
    }

    async updateProject(userId: string, id: string, projectData: ProjectUpdate): Promise<Project> {
        const [project] = await db
            .update(projects)
            .set(projectData)
            .where(
                and(
                    eq(projects.userId, userId),
                    eq(projects.id, id)
                )
            )
            .returning()

        console.log('updated project', project)

        return project;
    }

    async softDeleteProject(userId: string, id: string): Promise<number> {
        console.log('[projectRepository] softDeleteProject userId=%s id=%s', userId, id)
        const now = new Date()
        const rows = await db
            .update(projects)
            .set({ deletedAt: now, updatedAt: now })
            .where(and(
                eq(projects.userId, userId),
                eq(projects.id, id),
            ))
            .returning({ id: projects.id })
        console.log('[projectRepository] softDeleteProject rowsAffected=%d', rows.length)
        return rows.length
    }
}

export const projectRepository = new ProjectRepository();
