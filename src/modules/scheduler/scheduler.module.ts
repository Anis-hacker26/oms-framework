import { Module } from '@nestjs/common';
import {
  ScheduleModule,
} from '@nestjs/schedule';
import {
  DiscoveryModule,
} from '@nestjs/core';

import { SCHEDULER } from './constants/scheduler.constants';
import { NestSchedulerProvider } from './providers/nest-scheduler.provider';
import { SchedulerBootstrap } from './providers/scheduler.bootstrap';
import { SchedulerService } from './services/scheduler.service';
import { SampleScheduledTask } from './tasks/sample-scheduled-task';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DiscoveryModule,
  ],

  providers: [
    NestSchedulerProvider,

    {
      provide: SCHEDULER,
      useExisting: NestSchedulerProvider,
    },

    SchedulerService,
    SchedulerBootstrap,

    SampleScheduledTask,

  ],

  exports: [
    SchedulerService,
    SCHEDULER,
  ],
})
export class SchedulerModule {}