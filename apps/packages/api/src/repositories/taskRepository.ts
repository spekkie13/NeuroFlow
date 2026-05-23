import {Task, TaskInsert, TaskUpdate} from "../types/db.types.js";
import { db } from "../db/index.js"
import {tasks} from "../db/schema.js";
import {and, eq, inArray, isNull} from "drizzle-orm";

export class TaskRepository {
    async getTasksByProject(userId: string, projectId: string): Promise<Task[]> {
        return await db
            .select()
            .from(tasks)
            .where(
                and(
                    eq(tasks.userId, userId),
                    eq(tasks.projectId, projectId),
                    isNull(tasks.deletedAt)
                )
            )
    }

    async createTask(task: TaskInsert): Promise<Task> {
        const [result] = await db.insert(tasks)
            .values(task)
            .onConflictDoUpdate({
                target: tasks.id,
                set: { name: task.name, completed: task.completed, priority: task.priority, date: task.date, notes: task.notes, estimatedMinutes: task.estimatedMinutes, routineId: task.routineId, updatedAt: new Date() }
            })
            .returning();

        return result;
    }

    async syncProjectTasks(userId: string, projectId: string, incoming: TaskInsert[]): Promise<void> {
        const existing = await db
            .select({ id: tasks.id })
            .from(tasks)
            .where(and(eq(tasks.userId, userId), eq(tasks.projectId, projectId), isNull(tasks.deletedAt)))

        const incomingIds = new Set(incoming.map(t => t.id))
        const toDelete = existing.map(e => e.id).filter(id => !incomingIds.has(id))

        if (toDelete.length > 0) {
            await db.update(tasks)
                .set({ deletedAt: new Date() })
                .where(and(eq(tasks.userId, userId), inArray(tasks.id, toDelete)))
        }

        for (const task of incoming) {
            await db.insert(tasks)
                .values(task)
                .onConflictDoUpdate({
                    target: tasks.id,
                    set: { name: task.name, completed: task.completed, priority: task.priority, date: task.date, notes: task.notes, estimatedMinutes: task.estimatedMinutes, routineId: task.routineId, deletedAt: null, updatedAt: new Date() }
                })
        }
    }

    async updateTask(userId: string, task: TaskUpdate): Promise<Task> {
        const [updatedTask] = await db
            .update(tasks)
            .set({ userId: task.userId, name: task.name, completed: task.completed, priority: task.priority, date: task.date, notes: task.notes, estimatedMinutes: task.estimatedMinutes, updatedAt: new Date() })
            .where(and(
                eq(tasks.userId, userId),
                eq(tasks.id, task.id))
            )
            .returning();

        return updatedTask;
    }

    async softDeleteTask(userId: string, taskId: string): Promise<void> {
        await db
            .update(tasks)
            .set({ deletedAt: new Date() })
            .where(
                and(
                    eq(tasks.userId, userId),
                    eq(tasks.id, taskId)
                )
            )
    }
}

export const taskRepository = new TaskRepository();
