import { HealthStatus } from '../constants/health.constants';
import { HealthCheckResult } from './health-check.interface';

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly timestamp: string;
  readonly checks: readonly HealthCheckResult[];
}
