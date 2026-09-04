import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  HEALTH_CHECKS,
  HEALTH_STATUS,
} from '../constants/health.constants';
import { HealthCheck } from '../interfaces/health-check.interface';
import { HealthResponse } from '../interfaces/health-response.interface';

@Injectable()
export class HealthService {
  constructor(
    @Inject(HEALTH_CHECKS)
    private readonly healthChecks: readonly HealthCheck[],
  ) {}

  getLiveness(): HealthResponse {
    return {
      status: HEALTH_STATUS.UP,
      timestamp: new Date().toISOString(),
      checks: [],
    };
  }

  async getReadiness(): Promise<HealthResponse> {
    return this.runChecks();
  }

  async getHealth(): Promise<HealthResponse> {
    return this.runChecks();
  }

  private async runChecks(): Promise<HealthResponse> {
    const checks = await Promise.all(
      this.healthChecks.map(
        (healthCheck) => healthCheck.check(),
      ),
    );

    const status = checks.every(
      (check) => check.status === HEALTH_STATUS.UP,
    )
      ? HEALTH_STATUS.UP
      : HEALTH_STATUS.DOWN;

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
