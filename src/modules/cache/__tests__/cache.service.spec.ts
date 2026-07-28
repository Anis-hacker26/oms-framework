import { Test, TestingModule } from '@nestjs/testing';

import { CACHE_PROVIDER } from '../constants';
import { CacheService } from '../services/cache.service';

describe('CacheService', () => {
  let service: CacheService;

  const mockCacheProvider = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    clear: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_PROVIDER,
          useValue: mockCacheProvider,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delegate get()', async () => {
    mockCacheProvider.get.mockResolvedValue('value');

    const result = await service.get('key');

    expect(result).toBe('value');
    expect(mockCacheProvider.get).toHaveBeenCalledWith('key');
  });

  it('should delegate set()', async () => {
    await service.set('key', 'value');

    expect(mockCacheProvider.set).toHaveBeenCalledWith(
      'key',
      'value',
      undefined,
    );
  });

  it('should delegate delete()', async () => {
    mockCacheProvider.delete.mockResolvedValue(true);

    const result = await service.delete('key');

    expect(result).toBe(true);
    expect(mockCacheProvider.delete).toHaveBeenCalledWith('key');
  });

  it('should delegate exists()', async () => {
    mockCacheProvider.exists.mockResolvedValue(true);

    const result = await service.exists('key');

    expect(result).toBe(true);
    expect(mockCacheProvider.exists).toHaveBeenCalledWith('key');
  });

  it('should delegate expire()', async () => {
    mockCacheProvider.expire.mockResolvedValue(true);

    const result = await service.expire('key', 60);

    expect(result).toBe(true);
    expect(mockCacheProvider.expire).toHaveBeenCalledWith(
      'key',
      60,
    );
  });

  it('should delegate ttl()', async () => {
    mockCacheProvider.ttl.mockResolvedValue(300);

    const result = await service.ttl('key');

    expect(result).toBe(300);
    expect(mockCacheProvider.ttl).toHaveBeenCalledWith('key');
  });

  it('should delegate clear()', async () => {
    await service.clear('orders:*');

    expect(mockCacheProvider.clear).toHaveBeenCalledWith(
      'orders:*',
    );
  });

  it('should delegate increment()', async () => {
    mockCacheProvider.increment.mockResolvedValue(2);

    const result = await service.increment('counter');

    expect(result).toBe(2);
    expect(mockCacheProvider.increment).toHaveBeenCalledWith(
      'counter',
      1,
    );
  });

  it('should delegate decrement()', async () => {
    mockCacheProvider.decrement.mockResolvedValue(1);

    const result = await service.decrement('counter');

    expect(result).toBe(1);
    expect(mockCacheProvider.decrement).toHaveBeenCalledWith(
      'counter',
      1,
    );
  });
});