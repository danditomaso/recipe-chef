import { eq } from 'drizzle-orm'
import { db } from "@/db";
import { sessions } from "@/db/schema";
import type { CreateSessionDto } from "./types";

export async function createSessionRecord(item: CreateSessionDto) {
  return db.insert(sessions).values({
    ...item
  })
}

export async function findSession(sessionToken: string) {
  // return db.select(session).where(eq(sessions.userId, query.userId)).execute
  return await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken)).execute();
}
