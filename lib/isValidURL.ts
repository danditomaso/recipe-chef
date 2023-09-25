import { CleanReceipeRequestSchema } from "./types";

export function isValidURL(url: string) {
  console.log(url);

  const result = CleanReceipeRequestSchema.safeParse({ content: url });

  // if validation fails, return the error
  if (!result.success) {
    return { result, url, error: result.error.errors.at(0) };
  }

  return { result, url };
}
