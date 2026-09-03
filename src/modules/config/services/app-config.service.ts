import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  APP_CONFIG,
} from '../constants/config.constants';

import type {
  AppConfig,
} from '../interfaces/app-config.interface';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject(APP_CONFIG)
    private readonly config: AppConfig,
  ) {}

  get app(): AppConfig['app'] {
    return this.config.app;
  }

  get database(): AppConfig['database'] {
    return this.config.database;
  }

  get redis(): AppConfig['redis'] {
    return this.config.redis;
  }

  get jwt(): AppConfig['jwt'] {
    return this.config.jwt;
  }

  get storage(): AppConfig['storage'] {
    return this.config.storage;
  }
}