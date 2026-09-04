import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import {
  HEALTH_CHECKS,
} from './constants/health.constants';
import { HealthController } from './controllers/health.controller';
import { DatabaseHealthCheckProvider } from './providers/database-health-check.provider';
import { RedisHealthCheckProvider } from './providers/redis-health-check.provider';
import { HealthService } from './services/health.service';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [
    DatabaseHealthCheckProvider,
    RedisHealthCheckProvider,
    {
      provide: HEALTH_CHECKS,
      useFactory: (
        databaseHealthCheck: DatabaseHealthCheckProvider,
        redisHealthCheck: RedisHealthCheckProvider,
      ) => [
        databaseHealthCheck,
        redisHealthCheck,
      ],
      inject: [
        DatabaseHealthCheckProvider,
        RedisHealthCheckProvider,
      ],
    },
    HealthService,
  ],
  exports: [
    HealthService,
  ],
})
export class HealthModule {}
