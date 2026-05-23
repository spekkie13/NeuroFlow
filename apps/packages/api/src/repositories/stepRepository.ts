import { db } from "../db/index.js"
import {steps} from "../db/schema.js";
import {and, eq, inArray} from "drizzle-orm";
import {Step, StepInsert, StepUpdate} from "../types/db.types.js";

export class StepRepository {
    async getStepsByTask(userId: string, taskId: string): Promise<Step[]> {
        return await db
            .select()
            .from(steps)
            .where(
                and(
                    eq(steps.userId, userId),
                    eq(steps.taskId, taskId)
                )
            )
    }

    async createStep(newStep: StepInsert): Promise<Step> {
        const [step] = await db.insert(steps)
            .values(newStep)
            .onConflictDoUpdate({
                target: steps.id,
                set: { text: newStep.text, done: newStep.done }
            })
            .returning()
        return step
    }

    async updateStep(step: StepUpdate): Promise<Step> {
        const [updatedStep] = await db
            .update(steps)
            .set({ text: step.text, done: step.done })
            .where(eq(steps.id, step.id))
            .returning();

        return updatedStep;
    }

    async deleteStep(userId: string, stepId: string): Promise<void> {
        await db
            .delete(steps)
            .where(
                and(
                    eq(steps.userId, userId),
                    eq(steps.id, stepId)
                )
            )
    }

    async syncStepsForTask(userId: string, taskId: string, incoming: {id: string; text: string; done: boolean}[]): Promise<void> {
        const existing = await db.select({ id: steps.id }).from(steps).where(eq(steps.taskId, taskId))

        const incomingIds = new Set(incoming.map(s => s.id))
        const toDelete = existing.map(e => e.id).filter(id => !incomingIds.has(id))

        if (toDelete.length > 0) {
            await db.delete(steps).where(inArray(steps.id, toDelete))
        }

        for (const step of incoming) {
            await db.insert(steps)
                .values({ id: step.id, userId, taskId, text: step.text, done: step.done })
                .onConflictDoUpdate({ target: steps.id, set: { text: step.text, done: step.done } })
        }
    }
}

export const stepRepository = new StepRepository();
