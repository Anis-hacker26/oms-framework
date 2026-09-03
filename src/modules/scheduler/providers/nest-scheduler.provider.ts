import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import type { Scheduler } from '../interfaces/scheduler.interface';

@Injectable()
export class NestSchedulerProvider implements Scheduler {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  schedule(
    taskName: string,
    cronExpression: string,
    handler: () => Promise<void> | void,
  ): void {
    if (this.isScheduled(taskName)) {
      this.cancel(taskName);
    }

    const job = new CronJob(
      cronExpression,
      async () => {
        await handler();
      },
    );

    this.schedulerRegistry.addCronJob(
      taskName,
      job,
    );

    job.start();
  }

  cancel(taskName: string): void {
    if (!this.isScheduled(taskName)) {
      return;
    }

    this.schedulerRegistry.deleteCronJob(
      taskName,
    );
  }

  isScheduled(taskName: string): boolean {
    try {
      this.schedulerRegistry.getCronJob(
        taskName,
      );

      return true;
    } catch {
      return false;
    }
  }
}