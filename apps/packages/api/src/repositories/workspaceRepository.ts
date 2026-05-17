import { db } from "../db/index.js"
import {workspaces} from "../db/schema.js";
import {and, eq} from "drizzle-orm";
import {Workspace, WorkspaceInsert} from "../types/db.types.js";

export class WorkspaceRepository {
    async selectWorkspace(userId: string): Promise<Workspace[]> {
        return await db
            .select()
            .from(workspaces)
            .where(eq(workspaces.userId, userId))
    }

    async upsertWorkspace(workspace: WorkspaceInsert): Promise<Workspace> {
        const [result] = await db.insert(workspaces)
            .values(workspace)
            .onConflictDoUpdate({
                target: workspaces.id,
                set: { name: workspace.name, dailyMinutes: workspace.dailyMinutes, updatedAt: workspace.updatedAt },
            })
            .returning()
        return result
    }

    async updateWorkspace(userId: string, id: string, workspace: WorkspaceInsert): Promise<Workspace> {
        const [result] = await db
            .update(workspaces)
            .set({ name: workspace.name, dailyMinutes: workspace.dailyMinutes, updatedAt: new Date() })
            .where(
                and(
                    eq(workspaces.userId, userId),
                    eq(workspaces.id, id)
                )
            )
            .returning()

        return result;
    }

    async softDeleteWorkspace(userId: string, id: string): Promise<void> {
        await db
            .update(workspaces)
            .set({
                deletedAt: new Date()
            })
            .where(
                and(
                    eq(workspaces.userId, userId),
                    eq(workspaces.id, id)
                )
            )
    }
}

export const workspaceRepository = new WorkspaceRepository();
