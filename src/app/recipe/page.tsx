import { Recipe } from "@/models/Recipe";
import { Scraper } from "@/lib/Scraper";
import { PageProps } from "../../../.next/types/app/layout";
import { Result } from "neverthrow";
import { Cagliostro } from "next/font/google";

export default async function ({ searchParams }: PageProps) {
  // const _url = "https://www.wholefoodsmarket.com/recipes/turkey-sloppy-janes";
  const passedURL = searchParams?.url;
  console.log(passedURL);

  const scraper = new Scraper();
  const wrappedScrappedData: Result<Recipe, Error> = await scraper.cleanRecipe(passedURL);
  const scrappedData: Recipe | null = wrappedScrappedData.isOk() ? wrappedScrappedData.value : null;

  const recipe = {
    ingredients: scrappedData?.recipeIngredient ?? [],
    instructions: scrappedData?.recipeInstructions ?? [],
    title: scrappedData?.name ?? "",
    description: scrappedData?.description ?? "",
    images: scrappedData?.image ?? [],
    numServings: scrappedData?.recipeYield ?? "",
    totalTime: scrappedData?.totalTime ?? "",
    cookTime: scrappedData?.cookTime ?? "",
    reviews: scrappedData?.contentRating ?? [],
    prepTime: scrappedData?.prepTime ?? "",
  };
  console.log(recipe);

  return (
    <article className="flex flex-col bg-white p-6 rounded-lg">
      <div className="heading">
        <h2 className="font-bold text-3xl">{recipe.title.toString()}</h2>
        <p className="text-md text-ellipsis">{recipe.description.toString()}</p>
      </div>
      <div className="details"></div>
    </article>
  );
}
