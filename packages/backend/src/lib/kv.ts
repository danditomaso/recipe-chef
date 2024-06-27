import type { Result } from "@/types";
import type Redis from "ioredis";

interface KVProps {
  redisConnection: Redis;
}

interface GetSetKeyValue<T> {
  key: string | string[];
  value: T | null;
}

interface KVService {
  set(key: string | string[], value: string | Record<string, unknown>, opts?: { expireIn?: number }): Promise<Result<{ key: string | string[] }>>;
  get<T extends string | Record<string, unknown>>(key: string[]): Promise<Result<GetSetKeyValue<T>>>;
  delete(key: string[]): Promise<Result<number>>;
  list({
    prefix,
  }: { prefix: string[] }): Promise<Result<string[]>>;
}

export class KV implements KVService {
  private connection: Redis;

  constructor({ redisConnection }: KVProps) {
    this.connection = redisConnection;
  }

  private handleError<T>(error: unknown, errorMessage: string): Result<T> {
    console.error(errorMessage, error);
    return { success: false, error: new Error(errorMessage) };
  }

  /* 
  * Set multiple values in Redis
  * @param keys - key to set in Redis
  * @param value - value to set in Redis
  * @param opts - options for setting value in Redis
  * @param opts.expireIn - time in seconds after which the key will expire
  * @returns Result<{ key: string | string[] }>
  * @throws Error
  * */
  public async setMultiple(keys: { key: string | string[], value: string | Record<string, unknown>, opts?: { expireIn?: number } }[]): Promise<Result<{ key: string | string[] }[]>> {
    try {
      const results = await Promise.all(
        keys?.map(async ({ key, value, opts }) => {
          const setResult = await this.set(key, value, opts);

          if (setResult.success === false) {
            return { success: false, error: new Error("Failed to set value in Redis") };
          }

          return { success: true, data: { key: setResult.data?.key } };
        })
      );

      return { success: true, data: results };
    } catch (error) {
      return this.handleError<{ key: string | string[] }[]>(error, "Error setting value in Redis");
    }
  }


  /* 
  * Set value in Redis
  * @param key - key to set in Redis
  * @param value - value to set in Redis
  * @param opts - options for setting value in Redis
  * @param opts.expireIn - time in seconds after which the key will expire
  * @returns Result<{ key: string | string[] }>
  * @throws Error
  * */
  public async set(key: string | string[], value: string | Record<string, unknown>, opts?: { expireIn?: number }): Promise<Result<{ key: string | string[] }>> {
    try {
      const _value = typeof value === 'object' ? JSON.stringify(value) : value;

      const keyPrefix = Array.isArray(key) ? key.join(":") : key;
      const setResult = await this.connection.set(keyPrefix, _value)

      if (opts?.expireIn) {
        await this.connection.expire(
          keyPrefix,
          opts.expireIn,
        );
      }

      if (setResult !== "OK") {
        return { success: false, error: new Error("Failed to set value in Redis") };
      }

      return { success: true, data: { key: keyPrefix } };
    } catch (error) {
      return this.handleError<{ key: string | string[] }>(error, "Error setting value in Redis");
    }
  }

  public async get<T extends string | Record<string, unknown>>(key: string[]): Promise<Result<GetSetKeyValue<T>>> {
    try {
      const keyPrefix = key.join(":");
      const result = await this.connection.get(keyPrefix);

      if (!result) return { success: true, data: { key: keyPrefix, value: null } };

      const value = result.startsWith("{") && result.endsWith("}") ? JSON.parse(result) as T : result as unknown as T;

      return { success: true, data: { key: keyPrefix, value } };
    } catch (error) {
      return this.handleError<GetSetKeyValue<T>>(error, "Error getting value from Redis");
    }
  }

  public async delete(key: string[]): Promise<Result<number>> {
    try {
      const keyPrefix = key.join(":");
      const result = await this.connection.del(keyPrefix);
      return { success: true, data: result };
    } catch (error) {
      return this.handleError<number>(error, "Error deleting value from Redis");
    }
  }

  public async list({
    prefix,
  }: { prefix: string[] }): Promise<Result<string[]>> {
    try {
      const keyPrefix = prefix.join(":");
      const keys = await this.connection.keys(`${keyPrefix}:*`);
      return { success: true, data: keys };
    } catch (error) {
      return this.handleError<string[]>(error, "Error listing keys from Redis");
    }
  }
}
