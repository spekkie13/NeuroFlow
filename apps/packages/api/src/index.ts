import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { workspaceRoutes } from './routes/workspaces.js'
import { projectRoutes } from './routes/projects.js'
import { taskRoutes } from './routes/tasks.js'
import { settingsRoutes } from './routes/settings.js'

const app = Fastify({ logger: true })

await app.register(cors, {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})
await app.register(workspaceRoutes)
await app.register(projectRoutes)
await app.register(taskRoutes)
await app.register(settingsRoutes)

await app.ready()

export default async function handler(req: any, res: any) {
    app.server.emit('request', req, res)
}
