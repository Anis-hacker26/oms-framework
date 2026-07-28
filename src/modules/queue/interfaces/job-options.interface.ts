export interface JobOptions {
  /**
   * Delay job execution in milliseconds.
   */
  delay?: number;

  /**
   * Maximum retry attempts.
   */
  attempts?: number;

  /**
   * Job priority.
   * Lower numbers indicate higher priority.
   */
  priority?: number;

  /**
   * Backoff delay in milliseconds.
   */
  backoffDelay?: number;

  /**
   * Remove completed jobs automatically.
   */
  removeOnComplete?: boolean | number;

  /**
   * Remove failed jobs automatically.
   */
  removeOnFail?: boolean | number;
}