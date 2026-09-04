import { DatabaseHealthCheckProvider } from '../providers/database-health-check.provider';

describe('DatabaseHealthCheckProvider', () => {
  it('should report the database as up when the query succeeds', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
    };

    const provider =
      new DatabaseHealthCheckProvider(prisma as never);

    const result = await provider.check();

    expect(result.name).toBe('database');
    expect(result.status).toBe('up');
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('should report the database as down when the query fails', async () => {
    const prisma = {
      $queryRaw: jest
        .fn()
        .mockRejectedValue(new Error('Database unavailable')),
    };

    const provider =
      new DatabaseHealthCheckProvider(prisma as never);

    const result = await provider.check();

    expect(result.name).toBe('database');
    expect(result.status).toBe('down');
    expect(result.message).toBe('Database unavailable');
    expect(result.responseTimeMs).toBeGreaterThanOrEqual(0);
  });
});
