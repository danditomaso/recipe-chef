import dotenv from 'dotenv'
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from './schema'
import { Client } from "pg";

dotenv.config()

const client = new Client({
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
});

await client.connect();
export const db = drizzle(client, { schema });
