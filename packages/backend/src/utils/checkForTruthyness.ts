export const checkForTruthyness = <T>(properties: (keyof T)[]) => (obj: T): boolean => {
  return properties.every(prop => Boolean(obj?.[prop]));
};