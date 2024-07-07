export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}


export class ProcesingError extends Error {
  constructor() {
    super("The scraping queue ob processing");
    this.name = "JobProcessingError";
  }
}


export class ScrapingError extends Error {
  constructor() {
    super("Scraping failed to fetch data");
    this.name = "JobProcessingError";
  }
}
