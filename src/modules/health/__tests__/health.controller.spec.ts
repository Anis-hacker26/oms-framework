import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { HEALTH_STATUS } from '../constants/health.constants';
import { HealthController } from '../controllers/health.controller';
import { HealthResponse } from '../interfaces/health-response.interface';
import { HealthService } from '../services/health.service';

describe('HealthController', () => {
  const healthyResponse: HealthResponse = {
    status: HEALTH_STATUS.UP,
    timestamp: new Date().toISOString(),
    checks: [
      {
        name: 'database',
        status: HEALTH_STATUS.UP,
        responseTimeMs: 2,
      },
      {
        name: 'redis',
        status: HEALTH_STATUS.UP,
        responseTimeMs: 1,
      },
    ],
  };

  const unhealthyResponse: HealthResponse = {
    status: HEALTH_STATUS.DOWN,
    timestamp: new Date().toISOString(),
    checks: [
      {
        name: 'database',
        status: HEALTH_STATUS.DOWN,
        responseTimeMs: 5,
        message: 'Database unavailable',
      },
      {
        name: 'redis',
        status: HEALTH_STATUS.UP,
        responseTimeMs: 1,
      },
    ],
  };

  it('should return liveness without dependency checks', () => {
    const healthService = {
      getLiveness: jest.fn().mockReturnValue({
        status: HEALTH_STATUS.UP,
        timestamp: new Date().toISOString(),
        checks: [],
      }),
    };

    const controller =
      new HealthController(
        healthService as unknown as HealthService,
      );

    const result = controller.getLiveness();

    expect(result.status).toBe(HEALTH_STATUS.UP);
    expect(result.checks).toEqual([]);
    expect(
      healthService.getLiveness,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return healthy response from /health', async () => {
    const healthService = {
      getHealth: jest
        .fn()
        .mockResolvedValue(healthyResponse),
    };

    const controller =
      new HealthController(
        healthService as unknown as HealthService,
      );

    const result = await controller.getHealth();

    expect(result).toEqual(healthyResponse);
    expect(
      healthService.getHealth,
    ).toHaveBeenCalledTimes(1);
  });

  it('should throw 503 when /health is unhealthy', async () => {
    const healthService = {
      getHealth: jest
        .fn()
        .mockResolvedValue(unhealthyResponse),
    };

    const controller =
      new HealthController(
        healthService as unknown as HealthService,
      );

    await expect(
      controller.getHealth(),
    ).rejects.toMatchObject({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      response: unhealthyResponse,
    });
  });

  it('should return healthy response from /health/ready', async () => {
    const healthService = {
      getReadiness: jest
        .fn()
        .mockResolvedValue(healthyResponse),
    };

    const controller =
      new HealthController(
        healthService as unknown as HealthService,
      );

    const result =
      await controller.getReadiness();

    expect(result).toEqual(healthyResponse);
    expect(
      healthService.getReadiness,
    ).toHaveBeenCalledTimes(1);
  });

  it('should throw 503 when /health/ready is unhealthy', async () => {
    const healthService = {
      getReadiness: jest
        .fn()
        .mockResolvedValue(unhealthyResponse),
    };

    const controller =
      new HealthController(
        healthService as unknown as HealthService,
      );

    try {
      await controller.getReadiness();
      fail('Expected getReadiness to throw.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);

      const exception =
        error as HttpException;

      expect(
        exception.getStatus(),
      ).toBe(
        HttpStatus.SERVICE_UNAVAILABLE,
      );

      expect(
        exception.getResponse(),
      ).toEqual(unhealthyResponse);
    }
  });
});
