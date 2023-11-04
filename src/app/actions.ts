"use server";

import { Scraper } from "@/lib/Scraper";
import { isValidURL } from "@/lib/url";
import { redirect } from "next/navigation";

export async function handleURLInput(formData: FormData) {
  const rawURL = formData.get("url") as string;
  const scraper = new Scraper();
  const urlValidationResult = scraper.isValidURL(rawURL);
  const urlValidationError = urlValidationResult.isErr() ? urlValidationResult.error : null;
  urlValidationResult.isOk() ? redirect(`/recipe?url=${rawURL}`) : console.error(urlValidationError);

  return {};
}
