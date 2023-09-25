import { z } from "zod";
export function isValidURL(url: string) {
  const URLSchema = z.string().trim().min(1, { message: "URL must be longer than 1 character" }).max(256, { message: "URL is too long" }).url();
  const result = URLSchema.safeParse(url);

  if (result.success) {
    return true;
  } else {
    return false;
  }
}
