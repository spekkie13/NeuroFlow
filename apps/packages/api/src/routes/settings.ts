import { FastifyInstance } from 'fastify'
import { requireAuth } from "../middleware/auth.js"
import {settingsService} from "../services/settingsService.js";
import {UserSettings} from "../types/db.types.js";

export async function settingsRoutes(app: FastifyInstance) {
    app.get('/settings', { preHandler: requireAuth }, async (request, reply) => {
        const userId: string = request.user!.id;
        const settings: UserSettings[] = await settingsService.fetchSettingsByUserId(userId);

        return reply.send(settings[0] ?? null)
    })

    app.patch('/settings', { preHandler: requireAuth }, async (request, reply) => {
        const { globalReminderTime } = request.body as { globalReminderTime: string | null }
        const userId: string = request.user!.id;

        await settingsService.upsertGlobalReminderTime(userId, globalReminderTime);

        return reply.send({ success: true })
    })
}
