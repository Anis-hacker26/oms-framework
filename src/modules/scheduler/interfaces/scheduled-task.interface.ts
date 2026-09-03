export interface ScheduledTask {
  readonly taskName: string;
  readonly cronExpression: string;

  execute(): Promise<void> | void;
}