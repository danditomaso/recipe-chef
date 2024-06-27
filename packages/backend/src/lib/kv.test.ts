import { describe, it, expect, beforeEach, type Mock, vi } from 'vitest';
import Redis from 'ioredis';
import { KV } from './kv'; // Adjust the import path as necessary

vi.mock('ioredis');

const MockRedis = Redis as unknown as Mock;

describe('KV', () => {
  let kv: KV;
  let redisMock: Redis;

  beforeEach(() => {
    redisMock = new MockRedis();
    kv = new KV({ redisConnection: redisMock });
  });

  describe('set', () => {
    it('should set a key and return success', async () => {
      redisMock.set = vi.fn().mockResolvedValue('OK');
      redisMock.expire = vi.fn().mockResolvedValue(1);

      const result = await kv.set('key', 'value', { expireIn: 60 });

      expect(result).toEqual({ success: true, data: { key: 'key' } });
      expect(redisMock.set).toHaveBeenCalledWith('key', 'value');
      expect(redisMock.expire).toHaveBeenCalledWith('key', 60);
    });

    it('should return an error if setting the key fails', async () => {
      redisMock.set = vi.fn().mockRejectedValue(new Error('Set error'));

      const result = await kv.set('key', 'value');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(new Error('Error setting value in Redis'));
    });
  });

  describe('get', () => {
    it('should get a key and return the value', async () => {
      redisMock.get = vi.fn().mockResolvedValue('value');

      const result = await kv.get<string>(['key']);

      expect(result).toEqual({ success: true, data: { key: 'key', value: 'value' } });
      expect(redisMock.get).toHaveBeenCalledWith('key');
    });

    it('should return null if the key does not exist', async () => {
      redisMock.get = vi.fn().mockResolvedValue(null);

      const result = await kv.get<string>(['key']);

      expect(result).toEqual({ success: true, data: { key: 'key', value: null } });
    });

    it('should return an error if getting the key fails', async () => {
      redisMock.get = vi.fn().mockRejectedValue(new Error('Get error'));

      const result = await kv.get<string>(['key']);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(new Error('Error getting value from Redis'));
    });
  });

  describe('delete', () => {
    it('should delete a key and return the number of deleted keys', async () => {
      redisMock.del = vi.fn().mockResolvedValue(1);

      const result = await kv.delete(['key']);

      expect(result).toEqual({ success: true, data: 1 });
      expect(redisMock.del).toHaveBeenCalledWith('key');
    });

    it('should return an error if deleting the key fails', async () => {
      redisMock.del = vi.fn().mockRejectedValue(new Error('Delete error'));

      const result = await kv.delete(['key']);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(new Error('Error deleting value from Redis'));
    });
  });

  describe('list', () => {
    it('should list keys with a given prefix', async () => {
      redisMock.keys = vi.fn().mockResolvedValue(['key1', 'key2']);

      const result = await kv.list({ prefix: ["prefix"] });

      expect(result).toEqual({ success: true, data: ['key1', 'key2'] });
      expect(redisMock.keys).toHaveBeenCalledWith('prefix:*');
    });

    it('should return an error if listing keys fails', async () => {
      redisMock.keys = vi.fn().mockRejectedValue(new Error('List error'));

      const result = await kv.list({ prefix: ["prefix"] });

      expect(result.success).toBe(false);
      expect(result.error).toEqual(new Error('Error listing keys from Redis'));
    });
  });

});
