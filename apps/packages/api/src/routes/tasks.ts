import { FastifyInstance } from 'fastify'
import { requireAuth } from "../middleware/auth.js"
import {taskService} from "../services/taskService.js";
import {Step, Task} from "../types/db.types.js";
import {stepService} from "../services/stepService.js";

export async function taskRoutes(app: FastifyInstance) {
    app.get('/projects/:projectId/tasks', { preHandler: requireAuth }, async (request, reply) => {
        const { projectId } = request.params as { projectId: string }
        const userId: string = request.user!.id;

        const taskList: Task[] = await taskService.getTasksByProject(userId, projectId);

        const result = await Promise.all(
            taskList.map(async (task: Task) => {
                const stepList: Step[] = await stepService.getStepsByTask(userId, task.id);

                return { ...task, steps: stepList }
            })
        )

        return reply.send(result)
    })

    app.post('/projects/:projectId/tasks', { preHandler: requireAuth }, async (request, reply) => {
        const { projectId } = request.params as { projectId: string }
        const userId: string = request.user!.id;

        const { id, name, priority, date, notes, estimatedMinutes, steps: stepsInput } = request.body as {
            id?: string
            name: string
            priority?: 'high' | 'medium' | 'low'
            date?: string
            notes?: string
            estimatedMinutes?: number
            steps?: { text: string }[]
        }

        const task: Task = await taskService.createTask(userId, projectId, name, date, notes, estimatedMinutes, priority, id)
        let createdSteps: Step[] = []
        if (stepsInput?.length) {
            createdSteps = await stepService.createSteps(userId, task.id, stepsInput);
        }

        return reply.status(201).send({ ...task, steps: createdSteps })
    })

    app.patch('/projects/:projectId/tasks/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { projectId: string; id: string }
        const userId: string = request.user!.id;
        const { name, completed, priority, date, notes, estimatedMinutes } = request.body as {
            name: string
            completed: boolean
            priority?: 'high' | 'medium' | 'low'
            date?: string
            notes?: string
            estimatedMinutes?: number
        }
        await taskService.updateTask(userId, id, name, completed, priority, date, notes, estimatedMinutes);

        return reply.send({ success: true })
    })

    app.delete('/projects/:projectId/tasks/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { projectId: string; id: string }
        const userId: string = request.user!.id;

        await taskService.softDeleteTask(userId, id)
        return reply.status(201).send()
    })

    app.post('/tasks/:taskId/steps', { preHandler: requireAuth }, async (request, reply) => {
        const { taskId } = request.params as { taskId: string }
        const { text } = request.body as { text: string }
        const userId: string = request.user!.id;

        const step: Step = await stepService.createStep(userId, taskId, text);
        return reply.status(201).send(step)
    })

    app.patch('/tasks/:taskId/steps/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id, taskId } = request.params as { taskId: string; id: string }
        const { text, done } = request.body as { text?: string; done?: boolean }
        const userId: string = request.user!.id;

        const step: Step = await stepService.updateStep(userId, id, taskId, done, text);

        return reply.send(step);
    })

    app.delete('/tasks/:taskId/steps/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { taskId: string; id: string }
        const userId: string = request.user!.id;

        await stepService.deleteStep(userId, id);
        return reply.status(204).send()
    })
}
