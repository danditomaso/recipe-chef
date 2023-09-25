import { z } from "zod";

export type Action = {
  payload: string;
  status: number;
};

export const CleanReceipeRequestSchema = z.object({ content: z.string().trim().min(1).max(256).url() });

export type CleanReceipeRequestType = z.infer<typeof CleanReceipeRequestSchema>;
