import { Queue } from "bullmq";
import { connection } from "./redis";
import { Worker } from "bullmq";
import { RecipeScraper } from "./scraper/RecipeScraper";
import { createRecipe } from "@/data-access/recipe";
import { ScrapingError } from "./errors";

// type ScrapeJobArgs<T> = {
//   onStart: (job: Job) => Promise<T>;
//   onCompleted: (job: Job) => Promise<Partial<Recipe>>;
//   onFail?: (job: Job) => void;
//   onCleanup?: (job: Job) => void;
//   queueName?: string;
//   opts?: WorkerOptions
// };

// type ScrapeJobReturn = {
//   recipe: Partial<Recipe>;
//   id: string;
//   url: string;
// }

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}
const QUEUE_NAME = "scraping_queue";

export const scrapeQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

scrapeQueue.on("error", (error) => {
  console.error(`Queue error: ${error}`);
});

scrapeQueue.on("progress", (job) => {
  console.info(`👏 Job ${job.id} in progress`);
});

export function createScraperJob(url: string) {
  return scrapeQueue.add(QUEUE_NAME, { url }, { removeOnComplete: true, removeOnFail: true });
}

export default new Worker(
  QUEUE_NAME,
  async (job) => {
    try {
      const jobData = await job.data;
      const scraper = new RecipeScraper(jobData?.url);
      const scraperValue = await scraper.getRecipeData();

      if (!scraperValue || !scraperValue.ok) {
        throw new ScrapingError()
      }

      const recipeData = scraperValue.value
      createRecipe(recipeData, jobData?.url);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing job ${job.id}`, error);
        return job.updateData({ error: error.message });
      }
    } finally {
    }
  },
  {
    connection,
    concurrency: 10,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
);

// createQueueWorker({
//   async onStart(job) {
//     const jobData = await job.data;
//     const scraper = new RecipeScraper(jobData?.url);
//     const recipeData = await scraper.getRecipeData();

//     debuglog(`job processing data: ${jobData}`);

//     return { recipe: recipeData, id: jobData?.id, url: jobData?.url };
//   },
//   async onCompleted(job) {
//     debuglog(`job completed state: ${job.data}`);
//     const jobData = await job.data;
//     return jobData
//   },
//   async onFail(job) {
//     debuglog(`job failed state: ${job.data}`);
//     return job.data.error;
//   },
// });
