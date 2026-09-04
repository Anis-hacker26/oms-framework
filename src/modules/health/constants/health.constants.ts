export const HEALTH_STATUS = {
  UP: 'up',
  DOWN: 'down',
} as const;

export type HealthStatus =
  (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];

export const HEALTH_CHECKS = Symbol('HEALTH_CHECKS');
