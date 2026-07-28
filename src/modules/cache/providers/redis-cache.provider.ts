import { Injectable } from '@nestjs/common';

import { DEFAULT_CACHE_TTL } from '../constants/cache.constants';
import { CacheOptions, CacheProvider } from '../interfaces';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class RedisCacheProvider implements CacheProvider {
  constructor(
    private readonly redisService: RedisService,
  ) {}

  private buildKey(
    key: string,
    namespace?: string,
  ): string {
    return namespace ? `${namespace}:${key}` : key;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisService
      .getClient()
      .get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set<T>(
    key: string,
    value: T,
    options?: CacheOptions,
  ): Promise<void> {
    const redisKey = this.buildKey(
      key,
      options?.namespace,
    );

    const ttl =
      options?.ttl ?? DEFAULT_CACHE_TTL;

    await this.redisService
      .getClient()
      .set(
        redisKey,
        JSON.stringify(value),
        'EX',
        ttl,
      );
  }

  async delete(
    key: string,
  ): Promise<boolean> {
    const deleted = await this.redisService
      .getClient()
      .del(key);

    return deleted > 0;
  }

  async exists(
    key: string,
  ): Promise<boolean> {
    const exists = await this.redisService
      .getClient()
      .exists(key);

    return exists === 1;
  }

  async expire(
    key: string,
    ttl: number,
  ): Promise<boolean> {
    const result = await this.redisService
      .getClient()
      .expire(key, ttl);

    return result === 1;
  }

  async ttl(
    key: string,
  ): Promise<number> {
    return this.redisService
      .getClient()
      .ttl(key);
  }

  async clear(
    pattern?: string,
  ): Promise<void> {
    const client =
      this.redisService.getClient();

    if (!pattern) {
      await client.flushdb();
      return;
    }

    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(...keys);
    }
  }

  async increment(
    key: string,
    value = 1,
  ): Promise<number> {
    return this.redisService
      .getClient()
      .incrby(key, value);
  }

  async decrement(
    key: string,
    value = 1,
  ): Promise<number> {
    return this.redisService
      .getClient()
      .decrby(key, value);
  }
}