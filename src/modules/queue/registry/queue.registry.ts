import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { RedisService } from 'src/modules/redis/services/redis.service';

@Injectable()
export class QueueRegistry implements OnModuleDestroy {
  private readonly queues = new Map<string, Queue>();

 constructor(
  private readonly redisService: RedisService,
) {}

  getQueue(queueName: string): Queue {
    const existingQueue = this.queues.get(queueName);

    if (existingQueue) {
      return existingQueue;
    }

   const queue = new Queue(queueName, {
  connection: this.redisService.getClient(),
});

    this.queues.set(queueName, queue);

    return queue;
  }

  hasQueue(queueName: string): boolean {
    return this.queues.has(queueName);
  }

  getQueueNames(): string[] {
    return [...this.queues.keys()];
  }

  async closeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);

    if (!queue) {
      return;
    }

    await queue.close();

    this.queues.delete(queueName);
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(
      [...this.queues.values()].map((queue) => queue.close()),
    );

    this.queues.clear();
  }
}