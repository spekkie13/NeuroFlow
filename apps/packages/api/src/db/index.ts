import { drizzle } from 'drizzle-orm/postgres-js'
import postgres, {Sql} from 'postgres'
import * as schema from './schema.js'

const connectionString: string = process.env.DATABASE_URL!

const client: Sql = postgres(connectionString)
export const db = drizzle(client, { schema })
