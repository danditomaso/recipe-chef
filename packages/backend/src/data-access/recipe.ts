import { db } from "@/db";
import { eq } from "drizzle-orm";
import type { HowTo, HowToStep, Recipe as RecipeDTS, WithContext } from "schema-dts";
import { recipes, type Recipe } from "@/db/schema";
import { frame } from "jsonld";


export function toDtoMapper(recipe: RecipeDTS): Recipe {
  const extractValue = (schemaValue: any): string | null => {
    if (typeof schemaValue === 'string') {
      return schemaValue;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (schemaValue && typeof schemaValue.value === 'string') {
      return schemaValue.value;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (schemaValue && typeof schemaValue['@id'] === 'string') {
      return schemaValue['@id'];
    }
    return null;
  };

  const { cookTime, author, description, recipeCuisine, ingredients, image, recipeIngredient, recipeInstructions, name, prepTime, totalTime, recipeYield } = recipe;
  // console.log('recipe', recipeInstructions);

  //     "@context": "https://schema.org",
  //     "@type": "HowToStep",
  //     "@explict": true,
  //     identifer: {},
  //   } as HowToStep);
  //   console.log('inst', inst);

  // })

  return {
    authors: author,
    cookTime: extractValue(cookTime),
    cuisineType: extractValue(recipeCuisine),
    description: extractValue(description),
    imageUrls: image,
    ingredients: recipeIngredient ?? ingredients as WithContext<HowToStep>,
    instructions: Array.isArray(recipeInstructions) ? recipeInstructions : extractValue(recipeInstructions),
    name,
    prepTime: extractValue(prepTime),
    source_url: "",
    totalTime: extractValue(totalTime),
    yield: extractValue(recipeYield),
  };
}

export async function getRecipeByUrl(url: string) {
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.source_url, url),
  });
  return recipe
}

export async function createRecipe(item: RecipeDTS, url: string) {
  const recipeDto = toDtoMapper(item);

  return db.insert(recipes).values({
    ...recipeDto,
    source_url: url,
  }).returning({ url: recipes?.source_url });
}


export async function updateRecipeRecord(item: Recipe) {
  return db.update(recipes).set(item).where(eq(recipes?.publicId, item.publicId)).returning({ id: recipes?.id });
}



