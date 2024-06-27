// scrape.worker.ts

import { Worker, Queue, type Job } from "bullmq";
import { queue } from "../constants";
import { connection } from "../redis";
import { debuglog } from "node:util";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const scrapeQueue = new Queue(queue.SCRAPING_QUEUE, {
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
  return scrapeQueue.add(queue.SCRAPING_QUEUE, { url, id });
}

scrapeQueue.on("error", (error) => {
  console.error(`Queue error: ${error}`);
});

scrapeQueue.on("progress", (job) => {
  console.info(`👏 Job ${job.data.id} in progress`);
});

export const worker = new Worker(
  queue.SCRAPING_QUEUE,
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
  queueName = queue.SCRAPING_QUEUE,
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

// newQueueWorker({
//   async jobFn(job) {
//     const scraper = new RecipeScraper(job?.data?.url);
//     await scraper.scrapeRecipe();
//     const recipeData = scraper.getRecipeData();
//     debuglog(`job processing data: ${job.data}`);

//     return { recipe: recipeData, id: job.data?.id, url: job.data?.url };
//   },
//   async onSuccess(job) {
//     debuglog(`job completed state: ${job.data}`);

//     const recipe = job.data.recipe;

//     const recipeRecord = {
//       cookTime: recipe.cookTime,
//       prepTime: recipe.prepTime,
//       title: recipe.title,
//       ingredients: recipe.ingredients,
//       instructions: recipe.instructions,
//       servings: recipe.servings,
//       imageUrl: recipe.imageUrl,
//       original_url: job.data.url,
//     };
//     console.log(recipeRecord);

//     createRecipeRecord({ ...recipeRecord });

//     return updateJobRecord({
//       id: job.data.id,
//       url: job.data.url,
//       isCompleted: true,
//       status: "completed",
//     });
//   },
//   async onFailed(job) {
//     return updateJobRecord({
//       id: job.data.id,
//       url: job.data.url,
//       isCompleted: true,
//       status: "failed",
//     });
//   },
// });
