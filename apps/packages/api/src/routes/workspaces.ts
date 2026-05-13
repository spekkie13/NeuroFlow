import { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { db } from '../db'
import { workspaces } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function workspaceRoutes(app: FastifyInstance) {
    app.get('/workspaces', { preHandler: requireAuth }, async (request, reply) => {
        const result = await db
            .select()
            .from(workspaces)
            .where(eq(workspaces.userId, request.user!.id))

        return reply.send(result)
    })

    app.post('/workspaces', { preHandler: requireAuth }, async (request, reply) => {
        const { name, dailyMinutes } = request.body as { name: string; dailyMinutes?: number }

        const workspace = {
            id: randomUUID(),
            userId: request.user!.id,
            name,
            dailyMinutes: dailyMinutes ?? null,
        }

        await db.insert(workspaces).values(workspace)
        return reply.status(201).send(workspace)
    })

    app.patch('/workspaces/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const { name, dailyMinutes } = request.body as { name?: string; dailyMinutes?: number }

        await db
            .update(workspaces)
            .set({ name, dailyMinutes, updatedAt: new Date() })
            .where(eq(workspaces.id, id))

        return reply.send({ success: true })
    })

    app.delete('/workspaces/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }

        await db.delete(workspaces).where(eq(workspaces.id, id))

        return reply.status(204).send()
    })
}
