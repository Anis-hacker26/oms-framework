import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  APP_CONFIG,
} from '../constants/config.constants';

import type {
  AppConfig,
} from '../interfaces/app-config.interface';

import {
  ConfigModule,
} from '../config.module';

import {
  AppConfigService,
} from '../services/app-config.service';

describe('ConfigModule', () => {
  let module: TestingModule;

  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = {
      ...originalEnv,

      PORT: '4000',
      NODE_ENV: 'test',

      DATABASE_URL:
        'postgresql://test:test@localhost:5432/test',

      REDIS_HOST: 'redis-test',
      REDIS_PORT: '6380',
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

    module =
      await Test.createTestingModule({
        imports: [ConfigModule],
      }).compile();
  });

  afterEach(async () => {
    await module.close();
    process.env = originalEnv;
  });

  it('should provide AppConfigService', () => {
    const service =
      module.get<AppConfigService>(
        AppConfigService,
      );

    expect(service).toBeInstanceOf(
      AppConfigService,
    );
  });

  it('should provide the APP_CONFIG token', () => {
    const config =
      module.get<AppConfig>(APP_CONFIG);

    expect(config).toBeDefined();
    expect(config.app.port).toBe(4000);
    expect(config.redis.port).toBe(6380);
  });

  it('should expose typed configuration through AppConfigService', () => {
    const service =
      module.get<AppConfigService>(
        AppConfigService,
      );

    expect(service.app.port).toBe(4000);
    expect(service.app.nodeEnv).toBe(
      'test',
    );

    expect(service.database.url).toBe(
      'postgresql://test:test@localhost:5432/test',
    );

    expect(service.redis.host).toBe(
      'redis-test',
    );

    expect(service.redis.port).toBe(
      6380,
    );

    expect(service.jwt.accessSecret).toBe(
      'test-access-secret',
    );

    expect(service.jwt.refreshSecret).toBe(
      'test-refresh-secret',
    );

    expect(service.storage.localRoot).toBe(
      './test-storage',
    );
  });
});