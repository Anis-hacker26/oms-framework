import { Inject, Injectable } from '@nestjs/common';

import { SCHEDULER } from '../constants/scheduler.constants';

import type { Scheduler } from '../interfaces/scheduler.interface';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(SCHEDULER)
    private readonly scheduler: Scheduler,
  ) {}

  schedule(
    taskName: string,
    cronExpression: string,
    handler: () => Promise<void> | void,
  ): void {
    this.scheduler.schedule(
      taskName,
      cronExpression,
      handler,
    );
  }

  cancel(taskName: string): void {
    this.scheduler.cancel(taskName);
  }

  isScheduled(taskName: string): boolean {
    return this.scheduler.isScheduled(
      taskName,
    );
  }
}