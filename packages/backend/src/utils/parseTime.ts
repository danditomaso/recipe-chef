/**
 * Parses an ISO 8601 duration string and converts it to minutes.
 * @param duration - The ISO 8601 duration string (e.g., "PT4H30M", "30M").
 * @returns The duration in minutes as a number.
 */
export function parseDurationToMinutes(duration: string): number {
  const regex = /P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  const hours = matches[1] ? Number.parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? Number.parseInt(matches[2], 10) : 0;

  return hours * 60 + minutes;
}