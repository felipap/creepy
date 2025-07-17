import 'dotenv/config';

import assert from 'assert';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { createSafeQueryBuilder } from './query-builder';

const DATABASE_URL = process.env.DATABASE_URL || '';
assert(DATABASE_URL);

const baseDb = drizzle({
	connection: { connectionString: DATABASE_URL },
	schema,
	// logger: true,
});

export type BaseDb = typeof baseDb;

export const db: typeof baseDb = createSafeQueryBuilder(baseDb);
