import type { Matchers, Result } from "@/types";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const encase = <T, A extends any[]>(fn: (...args: A) => T) => (
  ...args: A
): Result<T> => {
  try {
    return { ok: true, value: fn(...args) };
  } catch (e) {
    return { ok: false, error: e };
  }
};

export const match = <T, E extends Error, R1, R2>(
  matchers: Matchers<T, E, R1, R2>,
) => (result: Result<T, E>) =>
    result.ok === true ? matchers.ok(result.value) : matchers.err(result.error);

export const wrap = <T, R>(fn: (value: T) => R) => (
  result: Result<T>,
): Result<R> =>
  result.ok === true ? { ok: true, value: fn(result.value) } : result;