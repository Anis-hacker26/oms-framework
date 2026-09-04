import { Injectable } from '@nestjs/common';

import { HEALTH_STATUS } from '../constants/health.constants';
import {
  HealthCheck,
  HealthCheckResult,
} from '../interfaces/health-check.interface';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class DatabaseHealthCheckProvider
  implements HealthCheck
{
  readonly name = 'database';

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const startedAt = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;

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
            : 'Database health check failed.',
      };
    }
  }
}
