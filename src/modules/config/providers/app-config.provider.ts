import {
  Injectable,
} from '@nestjs/common';

import type {
  AppConfig,
} from '../interfaces/app-config.interface';

@Injectable()
export class AppConfigProvider {
  getConfig(): AppConfig {
    return {
      app: {
        port: this.getNumber(
          'PORT',
          3000,
        ),
        nodeEnv:
          process.env.NODE_ENV ??
          'development',
      },

      database: {
        url: this.getRequired(
          'DATABASE_URL',
        ),
      },

      redis: {
        host:
          process.env.REDIS_HOST ??
          'localhost',

        port: this.getNumber(
          'REDIS_PORT',
          6379,
        ),

        username:
          process.env.REDIS_USERNAME ||
          undefined,

        password:
          process.env.REDIS_PASSWORD ||
          undefined,

        db: this.getNumber(
          'REDIS_DB',
          0,
        ),
      },

      jwt: {
        accessSecret:
          this.getRequired(
            'JWT_ACCESS_SECRET',
          ),

        accessExpiresIn:
          this.getRequired(
            'JWT_ACCESS_EXPIRES_IN',
          ),

        refreshSecret:
          this.getRequired(
            'JWT_REFRESH_SECRET',
          ),

        refreshExpiresIn:
          this.getRequired(
            'JWT_REFRESH_EXPIRES_IN',
          ),
      },

      storage: {
        localRoot:
          process.env.STORAGE_LOCAL_ROOT ??
          './storage',
      },
    };
  }

  private getRequired(
    name: string,
  ): string {
    const value = process.env[name];

    if (!value) {
      throw new Error(
        `Missing required environment variable: ${name}`,
      );
    }

    return value;
  }

  private getNumber(
    name: string,
    defaultValue: number,
  ): number {
    const value = process.env[name];

    if (!value) {
      return defaultValue;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(
        `Environment variable ${name} must be a valid number`,
      );
    }

    return parsed;
  }
}