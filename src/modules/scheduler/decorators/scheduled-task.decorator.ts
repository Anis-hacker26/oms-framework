import { SetMetadata } from '@nestjs/common';

export const SCHEDULED_TASK_METADATA = Symbol(
  'SCHEDULED_TASK_METADATA',
);

export interface ScheduledTaskMetadata {
  taskName: string;
  cronExpression: string;
}

export function ScheduledTask(
  taskName: string,
  cronExpression: string,
): ClassDecorator {
  return SetMetadata(
    SCHEDULED_TASK_METADATA,
    {
      taskName,
      cronExpression,
    } satisfies ScheduledTaskMetadata,
  );
}