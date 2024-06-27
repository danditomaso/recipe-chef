import type { Recipe } from "@/db/schema";
import type { Recipe as RecipeDTS } from "schema-dts";

// Use this type to get a recipe or update a recipe
export type RecipeDto = Pick<Recipe, "id" | "cookTime" | "prepTime" | "totalTime" | "recipeCuisine" | "recipeIngredient" | "recipeInstructions" | "recipeYield" | "original_url">

// Use this type to create a new recipe
export type CreateRecipeDto = Pick<Recipe, "cookTime" | "prepTime" | "totalTime" | "recipeCuisine" | "recipeIngredient" | "recipeInstructions" | "recipeYield" | "original_url">

export type PartialRecipe = Partial<RecipeDTS>;

export type RecipeId = {
  id: string;
};

export type CreateRecipe = (Job: CreateRecipeDto) => void;
export type DeleteRecipe = (JobId: number) => void;
export type UpdateRecipe = (Job: RecipeDto) => void;
export type GetRecipe = () => RecipeId | undefined;
export type GetRecipeById = (JobId: number) => Promise<RecipeDto>;
export type GetQueueUserJobByName = (
  userId: string,
  name: string
) => Promise<RecipeDto | undefined>;
