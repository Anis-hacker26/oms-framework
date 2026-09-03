jest.mock('@nestjs/schedule', () => {
  class MockSchedulerRegistry {
    private readonly jobs = new Map<string, unknown>();

    addCronJob(
      name: string,
      job: unknown,
    ): void {
      this.jobs.set(name, job);
    }

    deleteCronJob(
      name: string,
    ): void {
      this.jobs.delete(name);
    }

    getCronJob(
      name: string,
    ): unknown {
      const job = this.jobs.get(name);

      if (!job) {
        throw new Error(
          `Cron job "${name}" not found`,
        );
      }

      return job;
    }
  }

  class MockScheduleModule {
    static forRoot() {
      return {
        module: MockScheduleModule,
        providers: [
          MockSchedulerRegistry,
        ],
        exports: [
          MockSchedulerRegistry,
        ],
      };
    }
  }

  return {
    ScheduleModule: MockScheduleModule,
    SchedulerRegistry: MockSchedulerRegistry,
  };
});

jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation(
    (
      _cronExpression: string,
      _onTick: () => Promise<void> | void,
    ) => ({
      start: jest.fn(),
      stop: jest.fn(),
    }),
  ),
}));

import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { SchedulerModule } from '../scheduler.module';
import { SchedulerService } from '../services/scheduler.service';

describe('SchedulerModule', () => {
  let module: TestingModule;

  afterEach(async () => {
    if (!module) {
      return;
    }

    const schedulerService =
      module.get<SchedulerService>(
        SchedulerService,
      );

    const taskName =
      'scheduler.health-check';

    if (
      schedulerService.isScheduled(taskName)
    ) {
      schedulerService.cancel(taskName);
    }

    await module.close();
    module = undefined as unknown as TestingModule;
  });

  it('should automatically discover and register the sample scheduled task', async () => {
    module = await Test.createTestingModule({
      imports: [SchedulerModule],
    }).compile();

    await module.init();

    const schedulerService =
      module.get<SchedulerService>(
        SchedulerService,
      );

    expect(
      schedulerService.isScheduled(
        'scheduler.health-check',
      ),
    ).toBe(true);
  });
});