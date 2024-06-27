import { db } from "@/db";
import { eq } from "drizzle-orm";
import { recipes, type Recipe } from "@/db/schema";
import type { CreateRecipeDto, RecipeDto } from "./types";

export async function createRecipeRecord(item: CreateRecipeDto) {
  return db.insert(recipes).values({
    original_url: item.original_url,
    cookTime: item.cookTime,
    prepTime: item.prepTime,
    totalTime: item.totalTime,
    recipeCuisine: item.recipeCuisine,
    recipeIngredient: item.recipeIngredient,
    recipeInstructions: item.recipeInstructions,
    recipeYield: item.recipeYield,
  }).returning({ id: recipes?.id });
}


export async function updateRecipeRecord(item: RecipeDto) {
  return db.update(recipes).set(item).where(eq(recipes?.id, item.id)).returning({ id: recipes?.id });
}

export function toDtoMapper(item: Recipe) {
  return {
    id: item.id,
    original_url: item.original_url,
    cookTime: item.cookTime,
    prepTime: item.prepTime,
    totalTime: item.totalTime,
    recipeCuisine: item.recipeCuisine,
    recipeIngredient: item.recipeIngredient,
    recipeInstructions: item.recipeInstructions,
    recipeYield: item.recipeYield,
  }
}

