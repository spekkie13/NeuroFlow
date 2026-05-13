import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    const authHeader: string | undefined = request.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized' })
    }

    const token: string = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as jwt.JwtPayload
        request.user = { id: decoded.sub! }
    } catch {
        return reply.status(401).send({ error: 'Invalid token' })
    }
}
