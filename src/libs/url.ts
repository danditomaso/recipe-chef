import { binarySearch } from "../utils/search";
import { urlSchema } from "../models/Recipe/";
import allowedDomains from "./allowedDomains.json";
import { Result, err, ok } from "neverthrow";
import ExceptionList from "./exceptionList";

export function isValidURL(url: string): Result<boolean, Error> {
  const result = urlSchema.safeParse({ url });
  console.debug("URL passed to func", url);
  // if validation fails, return an error result
  if (!result.success) {
    return err(result?.error);
  }

  // if the domain is not on the allow list, return an error result
  if (isDomainAllowed(url).isErr()) {
    console.log(isDomainAllowed(url));
    return err(new Error(ExceptionList.DOMAIN_NOT_ON_ALLOW_LIST));
  }

  return ok(true);
}

export function isDomainAllowed(url: string): Result<boolean, Error> {
  const result = binarySearch(allowedDomains, new URL(url).host);
  if (result !== -1) {
    return ok(true);
  }
  return err(new Error(ExceptionList.DOMAIN_NOT_ON_ALLOW_LIST));
}
