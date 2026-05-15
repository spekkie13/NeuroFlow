import { createClient } from '@supabase/supabase-js'
import {FastifyReply, FastifyRequest} from "fastify";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    const authHeader: string | undefined = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized' })
    }

    const uid: string = authHeader.split(' ')[1]

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(uid)
    if (error || !data.user) {
        return reply.status(401).send({ error: 'Invalid token' })
    }

    request.user = { id: uid }
}
