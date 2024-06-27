import type { Job } from "@/db/schema";

// Use this type to get a job or update a job
export type JobDto = Pick<Job, "id" | "isCompleted" | "status" | "url">

// Use this type to create a new job
export type CreateJobDto = Pick<Job, "status" | "url" | "externalId">;

export type JobId = {
  userId: string;
};

export type CreateJob = (Job: CreateJobDto) => void;
export type DeleteJob = (JobId: number) => void;
export type UpdateJob = (Job: JobDto) => void;
export type GetJob = () => JobId | undefined;
export type GetJobById = (JobId: number) => Promise<JobDto>;
export type GetUserJobByName = (
  userId: string,
  name: string
) => Promise<JobDto | undefined>;
