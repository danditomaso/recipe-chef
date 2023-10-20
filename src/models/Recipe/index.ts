import { Recipe as _Recipe } from "schema-dts";
import { z } from "zod";

export const urlSchema = z.object({ url: z.string().trim().min(1).max(256).url() });

export type Recipe = _Recipe;
export type RecipeIngredients = Pick<_Recipe, "recipeIngredient">;
export type RrecipeInstructions = Pick<_Recipe, "recipeInstructions">;
