import 'dotenv/config'

const DATABASE_URL = process.env.DATABASE_URL || ''
assert(DATABASE_URL, 'DATABASE_URL is required')

import assert from 'assert'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export const db = drizzle({
  connection: { connectionString: DATABASE_URL },
  schema,
  logger: true,
})
