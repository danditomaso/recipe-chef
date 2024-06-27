import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, type User, } from "@/db/schema";
import type { CreateUserDto, UserDto, UserEmail } from "./types";

export async function upsertUser(item: CreateUserDto) {
  console.log({ item });
  const results = await db.select().from(users).where(eq(users.email, item.email)).execute();
  if (!results.length) {
    // if not exist create
    const insertResult = await db
      .insert(users)
      .values({ ...item }).returning({ id: users.id, publicId: users.publicId, email: users.email }).execute()
    return insertResult[0]
  }

  // update
  return db.update(users).set({
    ...item
  }).returning({ id: users.id, publicId: users.publicId, email: users.email })
}

export async function updateUser(item: UserDto) {
  return db.update(users).set(item).where(eq(users?.id, item.id)).returning({ publicId: users.publicId });
}

export async function findUserByEmail(item: UserEmail) {
  return db.select().from(users).where(eq(users.email, item.email)).execute();
}

export async function getUser(item: UserEmail) {
  await db.select().from(users).where(eq(users.email, item.email));
}

export function toDtoMapper(item: User) {
  return {
    id: item.id,
    email: item?.email,
    publicId: item?.publicId,
    picture: item?.picture,
  }
}

