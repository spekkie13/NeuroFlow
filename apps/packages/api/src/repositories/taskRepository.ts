import {Task, TaskInsert, TaskUpdate} from "../types/db.types.js";
import { db } from "../db/index.js"
import {tasks} from "../db/schema.js";
import {and, eq, inArray, isNull, lt} from "drizzle-orm";
import {tombstoneCutoff} from "../config/retention.js";

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
                    // Deliberately do NOT reset deletedAt: once a task is soft-deleted on the
                    // server, a stale push from another device must never resurrect it.
                    set: { name: task.name, completed: task.completed, priority: task.priority, date: task.date, notes: task.notes, estimatedMinutes: task.estimatedMinutes, routineId: task.routineId, updatedAt: new Date() }
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

    /**
     * Hard-delete this user's task tombstones that are older than the retention window.
     * Steps are removed automatically via the steps.taskId ON DELETE CASCADE. Returns the
     * number of tasks purged. Safe to call opportunistically on read paths.
     */
    async purgeExpiredDeletedTasks(userId: string): Promise<number> {
        const purged = await db
            .delete(tasks)
            .where(
                and(
                    eq(tasks.userId, userId),
                    lt(tasks.deletedAt, tombstoneCutoff())
                )
            )
            .returning({ id: tasks.id })

        return purged.length
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
