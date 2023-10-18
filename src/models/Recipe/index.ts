import { ZodError, z } from "zod";

export const urlSchema = z.object({ url: z.string().trim().min(1).max(256).url() });
export const RequestError = z.object({ result: z.string(), url: z.string(), error: typeof ZodError });
