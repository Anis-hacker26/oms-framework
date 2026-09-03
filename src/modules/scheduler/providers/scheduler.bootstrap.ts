import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  DiscoveryService,
  Reflector,
} from '@nestjs/core';

import {
  SCHEDULED_TASK_METADATA,
} from '../decorators/scheduled-task.decorator';

import type {
  ScheduledTaskMetadata,
} from '../decorators/scheduled-task.decorator';

import type {
  ScheduledTask,
} from '../interfaces/scheduled-task.interface';

import { SchedulerService } from '../services/scheduler.service';

@Injectable()
export class SchedulerBootstrap
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(
    SchedulerBootstrap.name,
  );

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly schedulerService: SchedulerService,
  ) {}

  onApplicationBootstrap(): void {
    this.registerScheduledTasks();
  }

  private registerScheduledTasks(): void {
    const providers =
      this.discoveryService.getProviders();

    let registeredCount = 0;

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;

      if (!instance || !metatype) {
        continue;
      }

      const metadata =
        this.reflector.get<ScheduledTaskMetadata>(
          SCHEDULED_TASK_METADATA,
          metatype,
        );

      if (!metadata) {
        continue;
      }

      const task = instance as ScheduledTask;

      this.schedulerService.schedule(
        metadata.taskName,
        metadata.cronExpression,
        () => task.execute(),
      );

      registeredCount++;

      this.logger.log(
        `Registered scheduled task "${metadata.taskName}" with cron "${metadata.cronExpression}"`,
      );
    }

    this.logger.log(
      `Scheduled task discovery completed: ${registeredCount} task(s) registered`,
    );
  }
}