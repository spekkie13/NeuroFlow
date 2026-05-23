import {Task} from "../types/db.types.js";
import {taskRepository} from "../repositories/taskRepository.js";
import {randomUUID} from "crypto";

export class TaskService {
    async getTasksByProject(userId: string, projectId: string): Promise<Task[]> {
        return await taskRepository.getTasksByProject(userId, projectId);
    }

    async createTask(userId: string, projectId: string, name: string, date?: string, notes?: string, estimatedMinutes?: number, completed?: boolean, priority?: 'high' | 'medium' | 'low', id?: string): Promise<Task> {
        const task = {
            id: id ?? randomUUID(),
            userId: userId,
            projectId,
            name,
            completed: completed,
            priority: priority ?? 'medium',
            date: date ?? null,
            notes: notes ?? '',
            estimatedMinutes: estimatedMinutes ?? null,
        }

        return await taskRepository.createTask(task);
    }

    async updateTask(userId: string, id: string, name: string, completed: boolean, priority?: 'high' | 'medium' | 'low', date?: string, notes?: string, estimatedMinutes?: number): Promise<Task> {
        const updatedTask = {
            id: id ?? randomUUID(),
            userId: userId,
            name: name,
            completed: completed,
            priority: priority ?? 'medium',
            date: date ?? null,
            notes: notes ?? '',
            estimatedMinutes: estimatedMinutes ?? null,
            updatedAt: new Date(),
        }
        return await taskRepository.updateTask(userId, updatedTask);
    }

    async softDeleteTask(userId: string, taskId: string): Promise<void> {
        return await taskRepository.softDeleteTask(userId, taskId);
    }

    async syncTasksForProject(userId: string, projectId: string, incoming: {
        id: string
        name: string
        completed: boolean
        priority?: 'high' | 'medium' | 'low'
        date?: string | null
        notes?: string
        estimatedMinutes?: number | null
        routineId?: string | null
    }[]): Promise<void> {
        const taskInserts = incoming.map(t => ({
            id: t.id,
            userId,
            projectId,
            name: t.name,
            completed: t.completed,
            priority: (t.priority ?? 'medium') as 'high' | 'medium' | 'low',
            date: t.date ?? null,
            notes: t.notes ?? '',
            estimatedMinutes: t.estimatedMinutes ?? null,
            routineId: t.routineId ?? null,
        }))
        await taskRepository.syncProjectTasks(userId, projectId, taskInserts)
    }
}

export const taskService = new TaskService();
