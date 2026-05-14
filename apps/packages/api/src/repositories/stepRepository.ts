import { db } from '../db/index.js'
import {steps} from "../db/schema";
import {and, eq} from "drizzle-orm";
import {Step, StepInsert, StepUpdate} from "../types/db.types";

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
            .returning();

        return step;
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
}

export const stepRepository = new StepRepository();
