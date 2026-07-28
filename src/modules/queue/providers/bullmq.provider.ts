import { Injectable } from '@nestjs/common';
import { JobsOptions } from 'bullmq';

import { QueueJob } from '../interfaces/queue-job.interface';
import { QueueProvider } from '../interfaces/queue-provider.interface';
import { QueueRegistry } from '../registry/queue.registry';

@Injectable()
export class BullMqProvider implements QueueProvider {
  constructor(
    private readonly queueRegistry: QueueRegistry,
  ) {}

private mapJobOptions<T>(job: QueueJob<T>): JobsOptions {
  return {
    delay: job.options?.delay,
    attempts: job.options?.attempts,
    priority: job.options?.priority,
    removeOnComplete: job.options?.removeOnComplete,
    removeOnFail: job.options?.removeOnFail,
    backoff: job.options?.backoffDelay
      ? {
          type: 'fixed',
          delay: job.options.backoffDelay,
        }
      : undefined,
  };
}

private mapQueueJob<T>(
  job: import('bullmq').Job<T>,
): QueueJob<T> {
  return {
    queue: job.queueName,
    name: job.name,
    payload: job.data,
  };
}

private async findJob(
  queueName: string,
  jobId: string,
) {
  const queue = this.queueRegistry.getQueue(queueName);

  return queue.getJob(jobId);
}

async enqueue<T>(job: QueueJob<T>): Promise<string> {
  const queue = this.queueRegistry.getQueue(job.queue);

const queuedJob = await queue.add(
  job.name,
  job.payload,
  this.mapJobOptions(job),
);

  return queuedJob.id!.toString();
}

async enqueueBulk<T>(jobs: QueueJob<T>[]): Promise<string[]> {
  if (jobs.length === 0) {
    return [];
  }

  const queueName = jobs[0].queue;

  if (jobs.some((job) => job.queue !== queueName)) {
    throw new Error('All jobs must belong to the same queue.');
  }

  const queue = this.queueRegistry.getQueue(queueName);

  const queuedJobs = await queue.addBulk(
    jobs.map((job) => ({
      name: job.name,
      data: job.payload,
      opts: this.mapJobOptions(job),
    })),
  );

  return queuedJobs.map((job) => job.id!.toString());
}

async getJob<T>(
  queueName: string,
  jobId: string,
): Promise<QueueJob<T> | null> {
  const job = await this.findJob(queueName, jobId);

  if (!job) {
    return null;
  }

  return this.mapQueueJob(job);
}

async remove(
  queueName: string,
  jobId: string,
): Promise<void> {
  const job = await this.findJob(queueName, jobId);

  if (!job) {
    return;
  }

  await job.remove();
}

async retry(
  queueName: string,
  jobId: string,
): Promise<void> {
  const job = await this.findJob(queueName, jobId);

  if (!job) {
    return;
  }

  await job.retry();
}

async pause(queueName: string): Promise<void> {
  const queue = this.queueRegistry.getQueue(queueName);

  await queue.pause();
}

async resume(queueName: string): Promise<void> {
  const queue = this.queueRegistry.getQueue(queueName);

  await queue.resume();
}

  async clean(queueName: string): Promise<void> {
    const queue = this.queueRegistry.getQueue(queueName);

    await queue.clean(0, 1000, 'completed');
  }
}