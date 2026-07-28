import { CacheOptions } from './cache-options.interface';

export interface CacheProvider {
  get<T>(key: string): Promise<T |null>;

  set<T>(
    key: string,
    value: T,
    options?: CacheOptions,
  ): Promise<void>;

  delete(key: string): Promise<boolean>;

  exists(key: string): Promise<boolean>;

  expire(
    key: string,
    ttl: number,
  ): Promise<boolean>;

  ttl(key: string): Promise<number>;

  clear(pattern?: string): Promise<void>;

  increment(
    key: string,
    value?: number,
  ): Promise<number>;

  decrement(
    key: string,
    value?: number,
  ): Promise<number>;
}