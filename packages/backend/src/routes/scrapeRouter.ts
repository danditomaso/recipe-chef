import { messages } from "@/data/messages/en";
import { createRecipeUseCase } from "@/use-cases/scrape";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const ValidURLSchema = z.string().url();

app.get("/recipe", async (c) => {
  const { url } = c.req.query();
  const result = ValidURLSchema.safeParse(url);

  if (!result.success) {
    return c.json({ ok: false, error: messages.error.INVALID_URL })
  }

  // TODO: temp disabled - Add a check to see if the domain is supported
  // if (!supportedDomains.includes(new URL(url).hostname)) {
  //   return c.json({
  //     ok: false,
  //     error: messages.error.UNSUPPORTED_DOMAIN,
  //   }, 400);
  // }

  // this function will check if the record exists and return it, 
  // otherwise start a new scrape job

  const existingRecord = await createRecipeUseCase(url)
  if (!existingRecord.ok) {
    return c.json({ ok: false, error: messages.error.SOMETHING_WENT_WRONG }, 200)
  }

  return c.json({ ok: true, value: existingRecord.value }, 201)

});

export default app;
