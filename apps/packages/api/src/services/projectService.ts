import {projectRepository} from "../repositories/projectRepository.js";
import {taskRepository} from "../repositories/taskRepository.js";
import {Project} from "../types/db.types";
import {randomUUID} from "crypto";

export class ProjectService {
    async getProjectsForWorkspace(userId: string, workspaceId: string): Promise<Project[]> {
        // Opportunistically purge expired task tombstones for this user. Runs in parallel
        // with the read so it adds no latency, and the read never returns expired tombstones
        // regardless (see projectRepository). Failures are swallowed — purging is best-effort.
        const [projects] = await Promise.all([
            projectRepository.getProjectsForWorkspace(userId, workspaceId),
            taskRepository.purgeExpiredDeletedTasks(userId).catch(() => 0),
        ]);
        return projects;
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

    async softDeleteProject(userId: string, id: string): Promise<void> {
        await projectRepository.softDeleteProject(userId, id);
    }
}

export const projectService = new ProjectService();
