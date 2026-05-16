import {workspaceRepository} from "../repositories/workspaceRepository.js";
import {randomUUID} from "crypto";
import {Workspace, WorkspaceInsert} from "../types/db.types.js";

export class WorkspaceService {
    async selectWorkspace(userId: string): Promise<Workspace[]> {
        return await workspaceRepository.selectWorkspace(userId);
    }

    async upsertWorkspace(userId: string, name: string, id?: string, dailyMinutes?: number, updatedAt?: string): Promise<WorkspaceInsert> {
        const workspace = {
            id: id ?? randomUUID(),
            userId: userId,
            name,
            dailyMinutes: dailyMinutes ?? null,
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        }

        await workspaceRepository.upsertWorkspace(workspace)
        return workspace;
    }

    async updateWorkspace(userId: string, id: string, name?: string, dailyMinutes?: number): Promise<Workspace> {
        const workspace = {
            id: id ?? randomUUID(),
            userId: userId,
            name: name ?? '',
            dailyMinutes: dailyMinutes ?? null,
        }

        return await workspaceRepository.updateWorkspace(userId, workspace.id, workspace);
    }

    async softDeleteWorkspace(userId: string, workspaceId: string) {
        await workspaceRepository.softDeleteWorkspace(userId, workspaceId);
    }
}

export const workspaceService = new WorkspaceService();
