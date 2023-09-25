"use server";
import { isValidURL } from "./lib/isValidURL";
import { redirect } from "next/navigation";

export async function submitRecipeRequest(formData: FormData) {
  "use server";
  const body = {
    url: formData.get("url"),
  };

  const { result, url, error } = isValidURL(body?.url as string);
  console.log(error);

  if (result.success === true) {
    return redirect(`?url=${body.url}`);
  } else {
    // if there is an error, on the client side show the not valid url error modal
  }
}
