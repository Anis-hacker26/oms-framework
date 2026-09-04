import { RedisHealthCheckProvider } from '../providers/redis-health-check.provider';

describe('RedisHealthCheckProvider', () => {
  it('should report Redis as up when ping succeeds', async () => {
    const redis = {
      ping: jest.fn().mockResolvedValue('PONG'),
    };

    const redisService = {
      getClient: jest.fn().mockReturnValue(redis),
    };

    const provider =
      new RedisHealthCheckProvider(
        redisService as never,
      );

    const result = await provider.check();

    expect(result.name).toBe('redis');
    expect(result.status).toBe('up');
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
    expect(redis.ping).toHaveBeenCalledTimes(1);
  });

  it('should report Redis as down when ping fails', async () => {
    const redis = {
      ping: jest
        .fn()
        .mockRejectedValue(new Error('Redis unavailable')),
    };

    const redisService = {
      getClient: jest.fn().mockReturnValue(redis),
    };

    const provider =
      new RedisHealthCheckProvider(
        redisService as never,
      );

    const result = await provider.check();

    expect(result.name).toBe('redis');
    expect(result.status).toBe('down');
    expect(result.message).toBe('Redis unavailable');
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
  });
});
