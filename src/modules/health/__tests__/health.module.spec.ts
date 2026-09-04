import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { RedisService } from '../../redis/services/redis.service';
import { HEALTH_CHECKS } from '../constants/health.constants';
import { HealthController } from '../controllers/health.controller';
import { DatabaseHealthCheckProvider } from '../providers/database-health-check.provider';
import { RedisHealthCheckProvider } from '../providers/redis-health-check.provider';
import { HealthService } from '../services/health.service';
import { HealthModule } from '../health.module';

describe('HealthModule', () => {
  let module: TestingModule;

  const prismaMock = {
    $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
  };

  const redisClientMock = {
    ping: jest.fn().mockResolvedValue('PONG'),
  };

  const redisMock = {
    getClient: jest.fn().mockReturnValue(redisClientMock),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .compile();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should provide HealthService', () => {
    const service = module.get<HealthService>(HealthService);

    expect(service).toBeInstanceOf(HealthService);
  });

  it('should provide HealthController', () => {
    const controller =
      module.get<HealthController>(HealthController);

    expect(controller).toBeInstanceOf(HealthController);
  });

  it('should register database and Redis health checks', () => {
    const checks = module.get(HEALTH_CHECKS);

    expect(checks).toHaveLength(2);
    expect(checks[0]).toBeInstanceOf(DatabaseHealthCheckProvider);
    expect(checks[1]).toBeInstanceOf(RedisHealthCheckProvider);
  });

  it('should wire health checks to their mocked dependencies', async () => {
    const service = module.get<HealthService>(HealthService);

    const result = await service.getReadiness();

    expect(result.status).toBe('up');
    expect(result.checks).toHaveLength(2);

    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
    expect(redisClientMock.ping).toHaveBeenCalledTimes(1);
  });
});
