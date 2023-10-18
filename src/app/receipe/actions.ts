"use server";

import { isValidURL } from "@/lib/url";
import { redirect } from "next/navigation";

export async function handleURLInput(formData: FormData) {
  const rawURL = formData.get("url") as string;
  const urlValidationResult = isValidURL(rawURL);
  const urlValidationError = urlValidationResult.isErr() ? urlValidationResult.error : null;
  urlValidationResult.isOk() ? redirect(`/receipe?url=${rawURL}`) : console.error(urlValidationError);

  return {};
}
