// scrape.ts
import { createJobRecord } from "@/data-access/job/";
import { scrapeQueue } from "@/lib/workers/scrape.worker";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { debuglog } from "node:util";

const app = new Hono();

app.get("/", async (c) => {
  const { url } = c.req.query();

  debuglog(`requested URL: ${url}`);
  const log = debuglog('API');
  const uniqueId = nanoid(32)

  try {
    const response = await createJobRecord(
      {
        status: "pending",
        url,
        externalId: uniqueId
      }
    );
    const insertedId = response.at(0)?.uuid;
    log(`inserting job with id:${response.at(0)}`);

    if (!insertedId) {
      return c.json({ status: "failed to insert job" }, 500);
    }

    log(`successfully inserted job with id:${insertedId}`);
    // add to queue
    scrapeQueue.add(url, insertedId?.toString());

    return c.json({ status: "scraping job started", id: insertedId }, 200);
  } catch (e) {
    log(`failed to insert job with error:${e}`);
    return c.json({ status: "failed to insert job" }, 500)
  }
});

export default app;
