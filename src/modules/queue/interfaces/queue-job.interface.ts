import { JobOptions } from './job-options.interface';

export interface QueueJob<T = unknown> {
  /**
   * Queue name.
   */
  queue: string;

  /**
   * Job name.
   */
  name: string;

  /**
   * Job payload.
   */
  payload: T;

  /**
   * Queue options.
   */
  options?: JobOptions;
}