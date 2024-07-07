import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'turso',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DB_AUTH_TOKEN,
  },
});