export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface Matchers<T, E extends Error, R1, R2> {
  ok(value: T): R1;
  err(error: E): R2;
}

export type InferZodMap<T extends abstract new (...args: any) => any> = {
  [k in keyof Partial<InstanceType<T>>]?: unknown;
};
