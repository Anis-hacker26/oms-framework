import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '../../redis/services/redis.service';
import { RedisCacheProvider } from '../providers/redis-cache.provider';

describe('RedisCacheProvider', () => {
  let provider: RedisCacheProvider;

  const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    flushdb: jest.fn(),
    keys: jest.fn(),
    incrby: jest.fn(),
    decrby: jest.fn(),
  };

  const mockRedisService = {
    getClient: jest.fn(() => mockRedisClient),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheProvider,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    provider = module.get<RedisCacheProvider>(
      RedisCacheProvider,
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should return cached value', async () => {
    mockRedisClient.get.mockResolvedValue(
      JSON.stringify({ id: 1 }),
    );

    const result = await provider.get('user:1');

    expect(result).toEqual({ id: 1 });
    expect(mockRedisClient.get).toHaveBeenCalledWith(
      'user:1',
    );
  });

  it('should return null when key does not exist', async () => {
    mockRedisClient.get.mockResolvedValue(null);

    const result = await provider.get('missing');

    expect(result).toBeNull();
  });

  it('should set value with default ttl', async () => {
    await provider.set('key', { value: 1 });

    expect(mockRedisClient.set).toHaveBeenCalled();
  });

  it('should set value with custom ttl', async () => {
    await provider.set(
      'key',
      { value: 1 },
      {
        ttl: 60,
      },
    );

    expect(mockRedisClient.set).toHaveBeenCalled();
  });

  it('should delete key', async () => {
    mockRedisClient.del.mockResolvedValue(1);

    const result = await provider.delete('key');

    expect(result).toBe(true);
  });

  it('should return false when delete affects no keys', async () => {
    mockRedisClient.del.mockResolvedValue(0);

    const result = await provider.delete('key');

    expect(result).toBe(false);
  });

  it('should return true when key exists', async () => {
    mockRedisClient.exists.mockResolvedValue(1);

    const result = await provider.exists('key');

    expect(result).toBe(true);
  });

  it('should return false when key does not exist', async () => {
    mockRedisClient.exists.mockResolvedValue(0);

    const result = await provider.exists('key');

    expect(result).toBe(false);
  });

  it('should update ttl', async () => {
    mockRedisClient.expire.mockResolvedValue(1);

    const result = await provider.expire(
      'key',
      60,
    );

    expect(result).toBe(true);
  });

  it('should return ttl', async () => {
    mockRedisClient.ttl.mockResolvedValue(120);

    const result = await provider.ttl('key');

    expect(result).toBe(120);
  });

  it('should clear all cache', async () => {
    await provider.clear();

    expect(
      mockRedisClient.flushdb,
    ).toHaveBeenCalled();
  });

  it('should clear keys matching pattern', async () => {
    mockRedisClient.keys.mockResolvedValue([
      'a',
      'b',
    ]);

    await provider.clear('orders:*');

    expect(mockRedisClient.keys).toHaveBeenCalledWith(
      'orders:*',
    );

    expect(mockRedisClient.del).toHaveBeenCalledWith(
      'a',
      'b',
    );
  });

  it('should increment value', async () => {
    mockRedisClient.incrby.mockResolvedValue(2);

    const result = await provider.increment(
      'counter',
    );

    expect(result).toBe(2);
  });

  it('should decrement value', async () => {
    mockRedisClient.decrby.mockResolvedValue(1);

    const result = await provider.decrement(
      'counter',
    );

    expect(result).toBe(1);
  });
});