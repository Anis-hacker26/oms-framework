import {
  AppConfigProvider,
} from '../providers/app-config.provider';

describe('AppConfigProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      PORT: '4000',
      NODE_ENV: 'test',

      DATABASE_URL:
        'postgresql://test:test@localhost:5432/test',

      REDIS_HOST: 'redis-test',
      REDIS_PORT: '6380',
      REDIS_USERNAME: 'test-user',
      REDIS_PASSWORD: 'test-password',
      REDIS_DB: '2',

      JWT_ACCESS_SECRET:
        'test-access-secret',

      JWT_ACCESS_EXPIRES_IN:
        '15m',

      JWT_REFRESH_SECRET:
        'test-refresh-secret',

      JWT_REFRESH_EXPIRES_IN:
        '7d',

      STORAGE_LOCAL_ROOT:
        './test-storage',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should build typed application configuration', () => {
    const provider =
      new AppConfigProvider();

    const config =
      provider.getConfig();

    expect(config).toEqual({
      app: {
        port: 4000,
        nodeEnv: 'test',
      },

      database: {
        url:
          'postgresql://test:test@localhost:5432/test',
      },

      redis: {
        host: 'redis-test',
        port: 6380,
        username: 'test-user',
        password: 'test-password',
        db: 2,
      },

      jwt: {
        accessSecret:
          'test-access-secret',

        accessExpiresIn:
          '15m',

        refreshSecret:
          'test-refresh-secret',

        refreshExpiresIn:
          '7d',
      },

      storage: {
        localRoot:
          './test-storage',
      },
    });
  });

  it('should apply defaults for optional configuration', () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;

    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_USERNAME;
    delete process.env.REDIS_PASSWORD;
    delete process.env.REDIS_DB;

    delete process.env.STORAGE_LOCAL_ROOT;

    const provider =
      new AppConfigProvider();

    const config =
      provider.getConfig();

    expect(config.app.port).toBe(3000);
    expect(config.app.nodeEnv).toBe(
      'development',
    );

    expect(config.redis.host).toBe(
      'localhost',
    );

    expect(config.redis.port).toBe(6379);
    expect(config.redis.db).toBe(0);

    expect(config.redis.username).toBeUndefined();
    expect(config.redis.password).toBeUndefined();

    expect(config.storage.localRoot).toBe(
      './storage',
    );
  });

  it('should reject missing required environment variables', () => {
    delete process.env.DATABASE_URL;

    const provider =
      new AppConfigProvider();

    expect(() =>
      provider.getConfig(),
    ).toThrow(
      'Missing required environment variable: DATABASE_URL',
    );
  });

  it('should reject missing JWT access secret', () => {
    delete process.env.JWT_ACCESS_SECRET;

    const provider =
      new AppConfigProvider();

    expect(() =>
      provider.getConfig(),
    ).toThrow(
      'Missing required environment variable: JWT_ACCESS_SECRET',
    );
  });

  it('should reject missing JWT refresh secret', () => {
    delete process.env.JWT_REFRESH_SECRET;

    const provider =
      new AppConfigProvider();

    expect(() =>
      provider.getConfig(),
    ).toThrow(
      'Missing required environment variable: JWT_REFRESH_SECRET',
    );
  });

  it('should reject invalid numeric environment variables', () => {
    process.env.PORT =
      'not-a-number';

    const provider =
      new AppConfigProvider();

    expect(() =>
      provider.getConfig(),
    ).toThrow(
      'Environment variable PORT must be a valid number',
    );
  });

  it('should reject invalid Redis port', () => {
    process.env.REDIS_PORT =
      'invalid-port';

    const provider =
      new AppConfigProvider();

    expect(() =>
      provider.getConfig(),
    ).toThrow(
      'Environment variable REDIS_PORT must be a valid number',
    );
  });
});