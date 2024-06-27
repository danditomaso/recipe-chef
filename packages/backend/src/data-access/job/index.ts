import { db } from "@/db";
import { eq } from "drizzle-orm";
import { jobs, type Job } from "@/db/schema";
import type { CreateJobDto, JobDto } from "./types";

export async function createJobRecord(item: CreateJobDto) {
  return db.insert(jobs).values({
    url: item.url,
    status: item.status,
    externalId: item.externalId,
  }).returning({ uuid: jobs?.externalId });
}
export async function updateJobRecord(item: JobDto) {
  return db.update(jobs).set(item).where(eq(jobs?.id, item.id)).returning({ id: jobs?.id });
}


export function toDtoMapper(item: Job) {
  return {
    id: item.id,
    url: item.url,
    isCompleted: item.isCompleted,
    status: item.status,
  }
}

