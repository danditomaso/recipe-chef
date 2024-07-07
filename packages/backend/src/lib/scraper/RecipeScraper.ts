import type { Recipe } from "schema-dts";

import { JSDOM } from "jsdom";
import { frame } from "jsonld";
import { randomUserAgent } from "@/lib/userAgent";
import type { Result } from "@/types";

class RecipeScraper {
  private recipeData: Recipe = {
    "@type": "Recipe",
  };
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
        })) as Recipe;

      }
    } catch (error) {
      if (typeof error === "object" && error && "message" in error) {
        console.error("Error scraping recipe:", error.message);
        throw { ok: false, error: error.message };
      }
    }
  }

  // public method to return recipe data 
  public async getRecipeData(): Promise<Result<Recipe>> {
    await this.scrapeRecipeData()
    return { ok: true, value: this.recipeData };
  }

}

export { RecipeScraper };
