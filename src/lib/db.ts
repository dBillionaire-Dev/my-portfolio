import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../../shared/schema';

// Support both local DATABASE_URL and Vercel/Neon env vars
function getDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (process.env.POSTGRES_URL) {
    return process.env.POSTGRES_URL;
  }
  return null;
}

const dbUrl = getDatabaseUrl();

let _db: any = null;

if (!dbUrl) {
  console.warn(
    "DATABASE_URL or POSTGRES_URL not set — running without a Postgres database. " +
    "Set DATABASE_URL in .env.local for local development with a real database."
  );
} else {
  const sql = neon(dbUrl);
  _db = drizzle(sql, { schema });
}

export const db = _db;

