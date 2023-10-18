import { Recipe } from "schema-dts";
import { ResultAsync, err, ok, okAsync } from "neverthrow";
import { JSDOM } from "jsdom";
import Exceptions from "./exceptionList";

export function safeJsonParse(res: Response) {
  ResultAsync.fromPromise(res.json(), () => Exceptions.PARSE_ERROR_JSON);
}

export async function extractJsonLdFromUrl(url: string, type: "Recipe" = "Recipe") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return err(new Error(Exceptions.PARSE_ERROR_NETWORK));
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const jsonLdScripts = dom.window.document.querySelectorAll('script[type="application/ld+json"]');

    const jsonLdObjects: Recipe[] = [];

    jsonLdScripts.forEach((script) => {
      try {
        const json = JSON.parse(script.textContent || "");
        if (json && json["@type"] === type) {
          jsonLdObjects.push(json);
        }
      } catch (error) {
        console.error("Error parsing JSON-LD:", error);
        return err(new Error(Exceptions.PARSE_ERROR_JSON));
      }
    });

    const [firstJsonLdObject] = jsonLdObjects ?? {};

    return okAsync(firstJsonLdObject);
  } catch (error) {
    console.error("Error:", error);
    return err(error);
  }
}
