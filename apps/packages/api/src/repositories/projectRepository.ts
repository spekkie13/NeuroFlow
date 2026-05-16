import {Project, ProjectInsert, ProjectUpdate} from "../types/db.types";
import {db} from "../db/index.js";
import {projects} from "../db/schema.js";
import {and, eq, isNull} from "drizzle-orm";

export class ProjectRepository {
    async getProjectsForWorkspace(userId: string, workspaceId: string): Promise<Project[]> {
        return await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.userId, userId),
                    eq(projects.workspaceId, workspaceId),
                    isNull(projects.deletedAt)
                )
            )
    }

    async createProject(projectData: ProjectInsert): Promise<Project> {
        const [project] = await db
            .insert(projects)
            .values(projectData)
            .onConflictDoUpdate({
                target: projects.id,
                set: { name: projectData.name, color: projectData.color, reminderTime: projectData.reminderTime, updatedAt: projectData.updatedAt },
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

        return project;
    }

    async softDeleteProject(userId: string, id: string): Promise<void> {
        await db
            .update(projects)
            .set({ deletedAt: new Date() })
            .where(and(
                eq(projects.userId, userId),
                eq(projects.id, id),
            ))
    }
}

export const projectRepository = new ProjectRepository();
