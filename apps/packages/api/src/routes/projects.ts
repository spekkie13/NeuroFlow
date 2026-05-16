import { FastifyInstance } from 'fastify'
import { requireAuth } from "../middleware/auth.js"
import { db } from "../db/index.js"
import { projects, tasks, steps } from "../db/schema.js"
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function projectRoutes(app: FastifyInstance) {
    app.get('/workspaces/:workspaceId/projects', { preHandler: requireAuth }, async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string }

        const projectList = await db
            .select()
            .from(projects)
            .where(eq(projects.workspaceId, workspaceId))

        const result = await Promise.all(
            projectList.map(async (project) => {
                const taskList = await db
                    .select()
                    .from(tasks)
                    .where(eq(tasks.projectId, project.id))

                const tasksWithSteps = await Promise.all(
                    taskList.map(async (task) => {
                        const stepList = await db
                            .select()
                            .from(steps)
                            .where(eq(steps.taskId, task.id))

                        return { ...task, steps: stepList }
                    })
                )

                return { ...project, tasks: tasksWithSteps }
            })
        )

        return reply.send(result)
    })

    app.post('/workspaces/:workspaceId/projects', { preHandler: requireAuth }, async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string }
        const { id, name, color, reminderTime } = request.body as {
            id?: string
            name: string
            color: string
            reminderTime?: string
        }

        const project = {
            id: id ?? randomUUID(),
            userId: request.user!.id,
            workspaceId,
            name,
            color,
            reminderTime: reminderTime ?? null,
        }

        await db.insert(projects)
            .values(project)
            .onConflictDoUpdate({
                target: projects.id,
                set: { name: project.name, color: project.color, reminderTime: project.reminderTime, updatedAt: new Date() }
            })
        return reply.status(201).send(project)
    })

    app.patch('/workspaces/:workspaceId/projects/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { workspaceId: string; id: string }
        const { name, color, reminderTime } = request.body as {
            name?: string
            color?: string
            reminderTime?: string
        }

        await db
            .update(projects)
            .set({ name, color, reminderTime, updatedAt: new Date() })
            .where(eq(projects.id, id))

        return reply.send({ success: true })
    })

    app.delete('/workspaces/:workspaceId/projects/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { workspaceId: string; id: string }

        await db.delete(projects).where(eq(projects.id, id))

        return reply.status(204).send()
    })
}
