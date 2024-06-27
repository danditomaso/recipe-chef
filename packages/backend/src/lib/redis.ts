// lib/redis.js
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
// maxRetriesPerRequest set to null to satisfy the bullMQ
const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null, password: process.env.REDIS_PASSWORD });

export { connection };
