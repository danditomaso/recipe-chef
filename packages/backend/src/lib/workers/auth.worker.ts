// scrape.worker.ts

import { Worker, Queue, type Job } from "bullmq";
import { queue } from "../constants";
import { connection } from "../redis";
import { debuglog } from "node:util";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const QUEUE_NAME = queue.USER_AUTH_QUEUE

export const userAuthQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export function addScrapeJob(url: string, id: string) {
  return userAuthQueue.add(QUEUE_NAME, { url, id });
}

userAuthQueue.on("error", (error) => {
  console.error(`Queue error: ${error}`);
});

userAuthQueue.on("progress", (job) => {
  console.info(`👏 Job ${job.data.id} in progress`);
});

export const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const data = job?.data;
    debuglog("Task executed successfully");
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
);

type ScrapeJobArgs<T> = {
  jobFn: (job: Job) => Promise<void>;
  onSuccess: (job: Job) => void;
  onFailed?: (job: Job) => void;
  onCleanup?: (job: Job) => void;
  queueName?: string;
  opts?: WorkerOptions
};

export async function newQueueWorker<T>({
  jobFn,
  onSuccess,
  onFailed,
  onCleanup,
  queueName = QUEUE_NAME,
  opts
}: ScrapeJobArgs<T>) {
  const { Worker } = await import("bullmq");
  const { connection } = await import("@/lib/redis");

  new Worker(
    queueName,
    async (job) => {
      try {
        const returnedData = jobFn(job);
        job.updateData(returnedData);
        onSuccess(job);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error processing job ${job.id}`, error);
          job.updateData({ error: error.message });
          onFailed?.(job.data);
        }
      } finally {
        onCleanup?.(job.data);
      }
    },
    {
      connection,
      concurrency: 10,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
      ...opts,
    },
  );
}
