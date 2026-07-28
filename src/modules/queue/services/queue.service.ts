import { Inject, Injectable } from '@nestjs/common';

import { QUEUE_PROVIDER } from '../constants/queue.tokens';
import { QueueJob } from '../interfaces/queue-job.interface';
import type { QueueProvider } from '../interfaces/queue-provider.interface';

@Injectable()
export class QueueService {
  constructor(
    @Inject(QUEUE_PROVIDER)
    private readonly queueProvider: QueueProvider,
  ) {}

  enqueue<T>(job: QueueJob<T>): Promise<string> {
    return this.queueProvider.enqueue(job);
  }

  enqueueBulk<T>(jobs: QueueJob<T>[]): Promise<string[]> {
    return this.queueProvider.enqueueBulk(jobs);
  }

  getJob<T>(
    queueName: string,
    jobId: string,
  ): Promise<QueueJob<T> | null> {
    return this.queueProvider.getJob(queueName, jobId);
  }

  remove(
    queueName: string,
    jobId: string,
  ): Promise<void> {
    return this.queueProvider.remove(queueName, jobId);
  }

  retry(
    queueName: string,
    jobId: string,
  ): Promise<void> {
    return this.queueProvider.retry(queueName, jobId);
  }

  pause(queueName: string): Promise<void> {
    return this.queueProvider.pause(queueName);
  }

  resume(queueName: string): Promise<void> {
    return this.queueProvider.resume(queueName);
  }

  clean(queueName: string): Promise<void> {
    return this.queueProvider.clean(queueName);
  }
}