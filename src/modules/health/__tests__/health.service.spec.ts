import { HEALTH_STATUS } from '../constants/health.constants';
import { HealthCheck } from '../interfaces/health-check.interface';
import { HealthService } from '../services/health.service';

describe('HealthService', () => {
  it('should report liveness as up without dependency checks', () => {
    const healthService = new HealthService([]);

    const result = healthService.getLiveness();

    expect(result.status).toBe(HEALTH_STATUS.UP);
    expect(result.checks).toEqual([]);
    expect(result.timestamp).toBeTruthy();
  });

  it('should report readiness as up when all checks succeed', async () => {
    const checks: HealthCheck[] = [
      {
        check: jest.fn().mockResolvedValue({
          name: 'database',
          status: HEALTH_STATUS.UP,
          responseTimeMs: 2,
        }),
      },
      {
        check: jest.fn().mockResolvedValue({
          name: 'redis',
          status: HEALTH_STATUS.UP,
          responseTimeMs: 1,
        }),
      },
    ];

    const healthService =
      new HealthService(checks);

    const result =
      await healthService.getReadiness();

    expect(result.status).toBe(HEALTH_STATUS.UP);
    expect(result.checks).toHaveLength(2);
    expect(checks[0].check).toHaveBeenCalledTimes(1);
    expect(checks[1].check).toHaveBeenCalledTimes(1);
  });

  it('should report readiness as down when any check fails', async () => {
    const checks: HealthCheck[] = [
      {
        check: jest.fn().mockResolvedValue({
          name: 'database',
          status: HEALTH_STATUS.UP,
          responseTimeMs: 2,
        }),
      },
      {
        check: jest.fn().mockResolvedValue({
          name: 'redis',
          status: HEALTH_STATUS.DOWN,
          responseTimeMs: 5,
          message: 'Redis unavailable',
        }),
      },
    ];

    const healthService =
      new HealthService(checks);

    const result =
      await healthService.getReadiness();

    expect(result.status).toBe(HEALTH_STATUS.DOWN);
    expect(result.checks).toHaveLength(2);
    expect(result.checks[1].message).toBe(
      'Redis unavailable',
    );
  });

  it('should execute health checks concurrently', async () => {
    let resolveDatabase:
      | ((value: {
          name: string;
          status: 'up';
          responseTimeMs: number;
        }) => void)
      | undefined;

    let resolveRedis:
      | ((value: {
          name: string;
          status: 'up';
          responseTimeMs: number;
        }) => void)
      | undefined;

    const databasePromise =
      new Promise((resolve) => {
        resolveDatabase = resolve;
      });

    const redisPromise =
      new Promise((resolve) => {
        resolveRedis = resolve;
      });

    const checks: HealthCheck[] = [
      {
        check: jest.fn().mockReturnValue(
          databasePromise,
        ),
      },
      {
        check: jest.fn().mockReturnValue(
          redisPromise,
        ),
      },
    ];

    const healthService =
      new HealthService(checks);

    const resultPromise =
      healthService.getReadiness();

    expect(checks[0].check).toHaveBeenCalledTimes(1);
    expect(checks[1].check).toHaveBeenCalledTimes(1);

    resolveDatabase?.({
      name: 'database',
      status: HEALTH_STATUS.UP,
      responseTimeMs: 2,
    });

    resolveRedis?.({
      name: 'redis',
      status: HEALTH_STATUS.UP,
      responseTimeMs: 1,
    });

    const result = await resultPromise;

    expect(result.status).toBe(HEALTH_STATUS.UP);
  });
});
