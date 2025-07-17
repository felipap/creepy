import "dotenv/config";

import assert from "assert";
import type { Config } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL || "";
assert(DATABASE_URL);

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
