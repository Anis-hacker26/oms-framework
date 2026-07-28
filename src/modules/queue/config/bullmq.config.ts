import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions } from '@nestjs/bullmq';

import {
  DEFAULT_JOB_ATTEMPTS,
  DEFAULT_JOB_BACKOFF_DELAY,
  DEFAULT_JOB_REMOVE_ON_COMPLETE,
  DEFAULT_JOB_REMOVE_ON_FAIL,
} from '../constants/queue.constants';

export function createBullMqConfig(
  configService: ConfigService,
): BullRootModuleOptions {
  return {
    connection: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      username:
        configService.get<string>('REDIS_USERNAME') || undefined,
      password:
        configService.get<string>('REDIS_PASSWORD') || undefined,
      db: configService.get<number>('REDIS_DB', 0),
    },

    prefix: configService.get<string>('QUEUE_PREFIX', 'oms'),

    defaultJobOptions: {
      attempts: DEFAULT_JOB_ATTEMPTS,

      backoff: {
        type: 'exponential',
        delay: DEFAULT_JOB_BACKOFF_DELAY,
      },

      removeOnComplete: DEFAULT_JOB_REMOVE_ON_COMPLETE,

      removeOnFail: DEFAULT_JOB_REMOVE_ON_FAIL,
    },
  };
}