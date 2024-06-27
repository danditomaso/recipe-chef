// https://stackoverflow.com/a/43467144/7355232
export function isValidHttpUrl(string: string) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}