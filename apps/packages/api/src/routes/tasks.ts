import { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { db } from '../db/index.js'
import { tasks, steps } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function taskRoutes(app: FastifyInstance) {
    app.get('/projects/:projectId/tasks', { preHandler: requireAuth }, async (request, reply) => {
        const { projectId } = request.params as { projectId: string }

        const taskList = await db
            .select()
            .from(tasks)
            .where(eq(tasks.projectId, projectId))

        const result = await Promise.all(
            taskList.map(async (task) => {
                const stepList = await db
                    .select()
                    .from(steps)
                    .where(eq(steps.taskId, task.id))

                return { ...task, steps: stepList }
            })
        )

        return reply.send(result)
    })

    app.post('/projects/:projectId/tasks', { preHandler: requireAuth }, async (request, reply) => {
        const { projectId } = request.params as { projectId: string }
        const { id, name, priority, date, notes, estimatedMinutes, steps: stepsInput } = request.body as {
            id?: string
            name: string
            priority?: 'high' | 'medium' | 'low'
            date?: string
            notes?: string
            estimatedMinutes?: number
            steps?: { text: string }[]
        }

        const task = {
            id: id ?? randomUUID(),
            userId: request.user!.id,
            projectId,
            name,
            completed: false,
            priority: priority ?? 'medium',
            date: date ?? null,
            notes: notes ?? '',
            estimatedMinutes: estimatedMinutes ?? null,
        }

        await db.insert(tasks)
            .values(task)
            .onConflictDoUpdate({
                target: tasks.id,
                set: { name: task.name, completed: task.completed, priority: task.priority, date: task.date, notes: task.notes, estimatedMinutes: task.estimatedMinutes, updatedAt: new Date() }
            })

        const createdSteps = []
        if (stepsInput?.length) {
            for (const step of stepsInput) {
                const newStep = {
                    id: randomUUID(),
                    userId: request.user!.id,
                    taskId: task.id,
                    text: step.text,
                    done: false,
                }
                await db.insert(steps)
                    .values(newStep)
                    .onConflictDoUpdate({
                        target: steps.id,
                        set: { text: newStep.text, done: newStep.done }
                    })

                createdSteps.push(newStep)
            }
        }

        return reply.status(201).send({ ...task, steps: createdSteps })
    })

    app.patch('/projects/:projectId/tasks/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { projectId: string; id: string }
        const { name, completed, priority, date, notes, estimatedMinutes } = request.body as {
            name?: string
            completed?: boolean
            priority?: 'high' | 'medium' | 'low'
            date?: string
            notes?: string
            estimatedMinutes?: number
        }

        await db
            .update(tasks)
            .set({ name, completed, priority, date, notes, estimatedMinutes, updatedAt: new Date() })
            .where(eq(tasks.id, id))

        return reply.send({ success: true })
    })

    app.delete('/projects/:projectId/tasks/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { projectId: string; id: string }

        await db.delete(tasks).where(eq(tasks.id, id))

        return reply.status(204).send()
    })

    // Steps
    app.post('/tasks/:taskId/steps', { preHandler: requireAuth }, async (request, reply) => {
        const { taskId } = request.params as { taskId: string }
        const { text } = request.body as { text: string }

        const step = {
            id: randomUUID(),
            userId: request.user!.id,
            taskId,
            text,
            done: false,
        }

        await db.insert(steps).values(step)
        return reply.status(201).send(step)
    })

    app.patch('/tasks/:taskId/steps/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { taskId: string; id: string }
        const { text, done } = request.body as { text?: string; done?: boolean }

        await db
            .update(steps)
            .set({ text, done })
            .where(eq(steps.id, id))

        return reply.send({ success: true })
    })

    app.delete('/tasks/:taskId/steps/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { taskId: string; id: string }

        await db.delete(steps).where(eq(steps.id, id))

        return reply.status(204).send()
    })
}
