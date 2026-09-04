import { Injectable } from '@nestjs/common';

import { HEALTH_STATUS } from '../constants/health.constants';
import {
  HealthCheck,
  HealthCheckResult,
} from '../interfaces/health-check.interface';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class RedisHealthCheckProvider
  implements HealthCheck
{
  readonly name = 'redis';

  constructor(
    private readonly redisService: RedisService,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const startedAt = Date.now();

    try {
      await this.redisService.getClient().ping();

      return {
        name: this.name,
        status: HEALTH_STATUS.UP,
        responseTimeMs: Date.now() - startedAt,
      };
    } catch (error) {
      return {
        name: this.name,
        status: HEALTH_STATUS.DOWN,
        responseTimeMs: Date.now() - startedAt,
        message:
          error instanceof Error
            ? error.message
            : 'Redis health check failed.',
      };
    }
  }
}
