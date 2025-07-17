import 'dotenv/config';

import assert from 'assert';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL || '';
assert(DATABASE_URL);

export const db = drizzle({
	connection: { connectionString: DATABASE_URL },
	schema,
	// logger: true,
});
