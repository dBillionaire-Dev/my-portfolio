import { defineConfig } from "drizzle-kit";

// Support both local DATABASE_URL and Vercel/Neon env vars
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  // Build connection string from individual Neon env vars
  if (process.env.POSTGRES_URL && process.env.POSTGRES_USER && process.env.POSTGRES_HOST && process.env.POSTGRES_DATABASE) {
    return process.env.POSTGRES_URL;
  }
  return "";
};

const dbUrl = getDatabaseUrl();

if (!dbUrl) {
  throw new Error("DATABASE_URL or POSTGRES_* env vars must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
