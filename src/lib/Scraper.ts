import { isValidURL } from "./url";
import { extractJsonLdFromUrl } from "./json";
import { ok, err, Result, Ok, ResultAsync } from "neverthrow";

import { Recipe } from "@/models/Recipe";
import Exceptions from "./exceptionList";
import { receipeMock } from "../../fixtures/recipeMock";

type ReceipeScaperService = {
  cleanRecipe: (url: string) => Promise<Result<Recipe, Error>>;
};

export class Scraper implements ReceipeScaperService {
  public async cleanRecipe(url: string) {
    // Check if the URL is valid
    if (!this.isValidURL(url)) {
      throw new Error("Invalid URL");
    }

    // Check if data for this URL already exists in the database
    // const existingData = await this.getDataFromDatabase(url);

    // if (!existingData) {
    // If data doesn't exist, scrape JSON-LD
    const scrapedData = await this.scrapeJSONLD(url);

    // const scrapedData = ok(receipeMock);

    // Save the scraped data to the database
    await this.saveDataToDatabase(url, scrapedData);

    // if (scrapedData?.isErr()) {
    //   return err(new Error(scrapedData?.error?.message));
    // }

    return scrapedData;
    // }
  }

  public isValidURL(url: string): Result<boolean, Error> {
    // Return true if the URL is valid, otherwise return false
    const { isOk } = isValidURL(url);
    return isOk() ? ok(true) : err(new Error(Exceptions.INVALID_URL));
  }

  private async getDataFromDatabase(url: string, table: string): Promise<any> {
    try {
      const result = await sql`SELECT ${table} ( Name varchar(255), Owner varchar(255) );`;
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  private async scrapeJSONLD(url: string) {
    // Return the scraped JSON-LD data
    const results = await extractJsonLdFromUrl(url);
    return results.isOk() ? results : err(new Error(Exceptions.PARSE_ERROR_JSON));
  }

  private async saveDataToDatabase(url: string, data: any): Promise<void> {
    // Implement logic to save the scraped data to the SQLite database
    // Insert a new record with the URL and scraped data
  }
}
