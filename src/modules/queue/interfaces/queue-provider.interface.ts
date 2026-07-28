import { QueueJob } from './queue-job.interface';

export interface QueueProvider {
  /**
   * Add a job to the queue.
   */
  enqueue<T>(job: QueueJob<T>): Promise<string>;

  /**
   * Add multiple jobs to the queue.
   */
  enqueueBulk<T>(jobs: QueueJob<T>[]): Promise<string[]>;

  /**
   * Retrieve a queued job.
   */
  getJob<T>(
    queueName: string,
    jobId: string,
  ): Promise<QueueJob<T> | null>;

  /**
   * Remove a queued job.
   */
  remove(queueName: string, jobId: string): Promise<void>;

  /**
   * Retry a failed job.
   */
  retry(queueName: string, jobId: string): Promise<void>;

  /**
   * Pause queue processing.
   */
  pause(queueName: string): Promise<void>;

  /**
   * Resume queue processing.
   */
  resume(queueName: string): Promise<void>;

  /**
   * Clean completed and failed jobs.
   */
  clean(queueName: string): Promise<void>;
}