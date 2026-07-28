import { Module } from '@nestjs/common';

import { RedisModule } from '../redis';

import { CACHE_PROVIDER } from './constants';
import { RedisCacheProvider } from './providers/redis-cache.provider';
import { CacheService } from './services';

@Module({
  imports: [RedisModule],
  providers: [
    CacheService,
    {
      provide: CACHE_PROVIDER,
      useClass: RedisCacheProvider,
    },
    RedisCacheProvider,
  ],
  exports: [
    CacheService,
    CACHE_PROVIDER,
  ],
})
export class CacheModule {}