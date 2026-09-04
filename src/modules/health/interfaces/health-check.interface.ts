import { HealthStatus } from '../constants/health.constants';

export interface HealthCheckResult {
  readonly name: string;
  readonly status: HealthStatus;
  readonly responseTimeMs: number;
  readonly message?: string;
}

export interface HealthCheck {
  check(): Promise<HealthCheckResult>;
}
