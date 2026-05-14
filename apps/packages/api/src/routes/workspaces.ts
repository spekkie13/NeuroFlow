import { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { workspaceService } from "../services/workspaceService";
import { Workspace, WorkspaceInsert } from "../types/db.types";

export async function workspaceRoutes(app: FastifyInstance) {
    app.get('/workspaces', { preHandler: requireAuth }, async (request, reply) => {
        const userId: string = request.user!.id
        const result: Workspace[] = await workspaceService.selectWorkspace(userId);

        return reply.status(200).send(result)
    })

    app.post('/workspaces', { preHandler: requireAuth }, async (request, reply) => {
        const { id, name, dailyMinutes } = request.body as { id?: string; name: string; dailyMinutes?: number }

        const userId: string = request.user!.id
        const workspace: WorkspaceInsert = await workspaceService.upsertWorkspace(userId, name, id, dailyMinutes);

        return reply.status(201).send(workspace)
    })

    app.patch('/workspaces/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const { name, dailyMinutes } = request.body as { name?: string; dailyMinutes?: number }
        const userId: string = request.user!.id;

        await workspaceService.updateWorkspace(userId, id, name, dailyMinutes)

        return reply.status(201).send({ success: true })
    })

    app.delete('/workspaces/:id', { preHandler: requireAuth }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const userId: string = request.user!.id;

        await workspaceService.deleteWorkspace(userId, id);
        return reply.status(204).send()
    })
}
