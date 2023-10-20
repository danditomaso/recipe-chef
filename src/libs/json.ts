import { Recipe } from "@/models/Recipe";
import { ResultAsync, err, ok, okAsync } from "neverthrow";
import { JSDOM } from "jsdom";
import Exceptions from "./exceptionList";

export function safeJsonParse(res: Response) {
  ResultAsync.fromPromise(res.json(), () => Exceptions.PARSE_ERROR_JSON);
}

export async function extractJsonLdFromUrl(url: string, desiredTypes: "Recipe" = "Recipe") {
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
        const json: Recipe = JSON.parse(script.textContent || "");
        if ((json && json["@type"]) || Array.isArray(json["@type"])) {
          for (const type of json["@type"]) {
            if (desiredTypes.includes(type)) {
              jsonLdObjects.push(json);
              break;
            }
          }
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
