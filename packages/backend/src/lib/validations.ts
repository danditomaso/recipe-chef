import type { Result } from "@/types";
import { messages } from '@/data/messages/en';
import { z } from "zod";
import { supportedDomains } from "./supportedDomains";

const urlSchema = z.string().url();

export function validateUrl(url: string): Result<string> {
  try {
    const parseResult = urlSchema.safeParse(url);

    if (!parseResult.success) {
      return { ok: false, error: new Error(messages.error.INVALID_URL) };
    }

    // Check if domain is in allowedDomains list
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    if (supportedDomains.includes(domain)) {
      return { ok: false, error: new Error(messages.error.UNSUPPORTED_DOMAIN) };
    }

    return { ok: true, value: url };
  } catch (error) {
    return { ok: false, error };
  }
}
