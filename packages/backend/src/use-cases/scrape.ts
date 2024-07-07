import { getRecipeByUrl } from "@/data-access/recipe";
import type { Recipe } from "@/db/schema";
import { createScraperJob } from "@/lib/scrape.worker";
import type { Result } from "@/types";


export async function createRecipeUseCase(url: string): Promise<Result<Recipe | string>> {
  // const existingRecipe = await getRecipeByUrl(url);

  // if (existingRecipe) {
  //   return { ok: true, value: existingRecipe }
  // }

  await createScraperJob(url);
  return { ok: true, value: url };
}

export async function getRecipeByUrlUseCase(url: string) {
  const existingRequest = await getRecipeByUrl(url);

  if (existingRequest) {
    return existingRequest;
  }
}

// export async function getRecipeByPublicIdUseCase(id: string) {
//   const existingRequest = await getRecipeByUrl(id);

//   if (existingRequest) {
//     return existingRequest;
//   }
// }

// export async function createGoogleUserUseCase(googleUser: GoogleUser) {
//   let existingUser = await getUserByEmail(googleUser.email);

//   if (!existingUser) {
//     existingUser = await createUser(googleUser.email);
//   }

//   await createAccountViaGoogle(existingUser.id, googleUser.id);

//   await createProfile(existingUser.id, googleUser.name, googleUser.picture);

//   return existingUser.id;
// }