import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const result = await this.client.get(key);

    if (!result) {
      return null;
    }

    const parsedResult = JSON.parse(result) as T;

    return parsedResult;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(keyPrefix: string): Promise<void> {
    const keys = await this.client.keys(`${keyPrefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}

export default RedisCacheProvider;
