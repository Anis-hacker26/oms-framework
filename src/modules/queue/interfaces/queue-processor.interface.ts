import { Job } from 'bullmq';

export interface QueueProcessor<T = unknown, TResult = unknown> {
  /**
   * Processes a queue job.
   */
  process(job: Job<T>): Promise<TResult>;
}