import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

  private readonly client: Redis;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new Redis({
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
      username: this.configService.get<string>('REDIS_USERNAME'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: this.configService.get<number>('REDIS_DB') ?? 0,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.ping();

      this.logger.log('Redis connection established successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to connect to Redis.',
        error instanceof Error ? error.stack : undefined,
      );

      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();

    this.logger.log('Redis connection closed.');
  }

  getClient(): Redis {
    return this.client;
  }
}