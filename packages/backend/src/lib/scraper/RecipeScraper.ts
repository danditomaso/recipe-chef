import type { PartialRecipe } from "@/data-access/recipes/types";
import type { Recipe } from "schema-dts";

import { JSDOM } from "jsdom";
import { frame } from "jsonld";
import { randomUserAgent } from "@/utils/userAgent";

class RecipeScraper {
  private recipeData: PartialRecipe = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  private async scrapeRecipeData(): Promise<void> {
    try {
      // fetch and parse HTML
      const {
        window: { document },
      } = await JSDOM.fromURL(this.url, { userAgent: randomUserAgent() });

      // select the script elements containing JSON-LD
      const elements = document.querySelectorAll(
        "script[type='application/ld+json']",
      );

      if (![...elements].length) {
        throw new Error("No JSON-LD script elements found");
      }

      for (const element of elements) {
        // parse the JSON
        const doc = JSON.parse(element?.textContent ?? "");
        // frame the doc to filter and pick certain properties
        this.recipeData = (await frame(doc, {
          "@context": "https://schema.org",
          "@type": "Recipe",
          "@explict": true,
          identifer: {},
          // 'name': {},
          // 'description': {},
          // 'image': {},
        })) as PartialRecipe;
        console.log(this.recipeData);

      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error scraping recipe:", error.message);
        throw new Error(error.message);
      }
    }
  }

  public async scrapeRecipe(): Promise<void> {
    this.scrapeRecipeData()
  }

  // public method to return recipe data 
  public getRecipeData(): Partial<Recipe> {
    return this.recipeData;
  }
}

export { RecipeScraper };
