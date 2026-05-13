import { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { db } from '../db/index.js'
import { userSettings } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export async function settingsRoutes(app: FastifyInstance) {
    app.get('/settings', { preHandler: requireAuth }, async (request, reply) => {
        const result = await db
            .select()
            .from(userSettings)
            .where(eq(userSettings.userId, request.user!.id))

        return reply.send(result[0] ?? null)
    })

    app.patch('/settings', { preHandler: requireAuth }, async (request, reply) => {
        const { globalReminderTime } = request.body as { globalReminderTime: string | null }

        await db
            .insert(userSettings)
            .values({
                userId: request.user!.id,
                globalReminderTime,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: userSettings.userId,
                set: {
                    globalReminderTime,
                    updatedAt: new Date(),
                },
            })

        return reply.send({ success: true })
    })
}
