export interface Scheduler {
  schedule(
    taskName: string,
    cronExpression: string,
    handler: () => Promise<void> | void,
  ): void;

  cancel(taskName: string): void;

  isScheduled(taskName: string): boolean;
}