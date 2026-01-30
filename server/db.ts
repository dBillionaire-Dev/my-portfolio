import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: any = undefined;
let db: any = undefined;

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL not set — running without a Postgres database. Using in-memory fallback storage for development.",
  );
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { pool, db };
