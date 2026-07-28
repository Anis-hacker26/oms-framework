import { Inject, Injectable } from '@nestjs/common';

import { CACHE_PROVIDER } from '../constants';
import type {
  CacheOptions,
  CacheProvider,
} from '../interfaces';
@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProvider,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cacheProvider.get<T>(key);
  }

  async set<T>(
    key: string,
    value: T,
    options?: CacheOptions,
  ): Promise<void> {
    await this.cacheProvider.set(
      key,
      value,
      options,
    );
  }

  async delete(
    key: string,
  ): Promise<boolean> {
    return this.cacheProvider.delete(key);
  }

  async exists(
    key: string,
  ): Promise<boolean> {
    return this.cacheProvider.exists(key);
  }

  async expire(
    key: string,
    ttl: number,
  ): Promise<boolean> {
    return this.cacheProvider.expire(
      key,
      ttl,
    );
  }

  async ttl(
    key: string,
  ): Promise<number> {
    return this.cacheProvider.ttl(key);
  }

  async clear(
    pattern?: string,
  ): Promise<void> {
    await this.cacheProvider.clear(pattern);
  }

  async increment(
    key: string,
    value = 1,
  ): Promise<number> {
    return this.cacheProvider.increment(
      key,
      value,
    );
  }

  async decrement(
    key: string,
    value = 1,
  ): Promise<number> {
    return this.cacheProvider.decrement(
      key,
      value,
    );
  }
}