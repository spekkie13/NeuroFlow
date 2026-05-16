import {stepRepository} from "../repositories/stepRepository.js";
import {Step} from "../types/db.types.js";
import {randomUUID} from "crypto";

export class StepService {
    async getStepsByTask(userId: string, taskId: string): Promise<Step[]> {
        return await stepRepository.getStepsByTask(userId, taskId)
    }

    async createStep(userId: string, taskId: string, step: string): Promise<Step> {
        const newStep = {
            id: randomUUID(),
            userId: userId,
            taskId: taskId,
            text: step,
            done: false,
        }

        return await stepRepository.createStep(newStep);
    }

    async createSteps(userId: string, taskId: string,     stepInput: { id?: string; text: string; done?: boolean }[]): Promise<Step[]> {
        const createdSteps = []

        for (const step of stepInput) {
            const newStep = {
                id: step.id ?? randomUUID(),
                userId,
                taskId,
                text: step.text,
                done: step.done ?? false,
            }
            const created: Step = await stepRepository.createStep(newStep)
            createdSteps.push(created)
        }
        return createdSteps;
    }

    async updateStep(userId: string, stepId: string, taskId: string, done?: boolean, text?: string): Promise<Step> {
        const updatedStep = {
            id: stepId ?? randomUUID(),
            userId: userId,
            taskId: taskId,
            text: text,
            done: done
        }

        return await stepRepository.updateStep(updatedStep);
    }

    async deleteStep(userId: string, stepId: string): Promise<void> {
        await stepRepository.deleteStep(userId, stepId);
    }
}

export const stepService = new StepService();
