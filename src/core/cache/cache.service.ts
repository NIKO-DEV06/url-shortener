import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cache.set(key, value, { ttl } as any);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    try {
      // For redis cache, use store.reset() or flushdb() to clear all keys
      const cacheStore = (this.cache as any).store;
      if (cacheStore && typeof cacheStore.reset === 'function') {
        await cacheStore.reset();
      } else if (cacheStore && typeof cacheStore.flushdb === 'function') {
        await cacheStore.flushdb();
      } else {
        // Fallback: try to clear cache using store client
        const client = cacheStore?.getClient ? cacheStore.getClient() : null;
        if (client && typeof client.flushdb === 'function') {
          await client.flushdb();
        }
      }
    } catch (error) {
      // Fallback: if cache reset doesn't work, we'll just skip it in tests
      console.warn('Cache reset failed, continuing with test:', error.message);
    }
  }

  async onModuleDestroy() {
    try {
      const cacheStore = (this.cache as any).store;
      const redisClient = cacheStore?.getClient ? cacheStore.getClient() : null;
      if (redisClient && typeof redisClient.quit === 'function') {
        await redisClient.quit();
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error.message);
    }
  }
}
