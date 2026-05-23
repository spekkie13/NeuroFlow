import {projectRepository} from "../repositories/projectRepository.js";
import {Project} from "../types/db.types";
import {randomUUID} from "crypto";

export class ProjectService {
    async getProjectsForWorkspace(userId: string, workspaceId: string): Promise<Project[]> {
        return await projectRepository.getProjectsForWorkspace(userId, workspaceId);
    }

    async createProject(userId: string, id: string, workspaceId: string, name: string, color: string, reminderTime?: string, routines?: any[], updatedAt?: string) {
        const project = {
            id: id ?? randomUUID(),
            userId: userId,
            workspaceId,
            name,
            color,
            reminderTime: reminderTime ?? null,
            routines: routines ?? [],
            updatedAt: updatedAt ? new Date(updatedAt) : new Date()
        }

        return await projectRepository.createProject(project);
    }

    async updateProject(userId: string, id: string, workspaceId: string, name?: string, color?: string, reminderTime?: string): Promise<Project> {
        const project = {
            id: id,
            userId: userId,
            workspaceId: workspaceId,
            name: name,
            color: color,
            reminderTime: reminderTime,
        }

        return await projectRepository.updateProject(userId, id, project);
    }

    async softDeleteProject(userId: string, workspaceId: string): Promise<void> {
        return await projectRepository.softDeleteProject(userId, workspaceId);
    }
}

export const projectService = new ProjectService();
