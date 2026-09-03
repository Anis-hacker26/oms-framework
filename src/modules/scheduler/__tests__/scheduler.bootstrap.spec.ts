import 'reflect-metadata';

import {
  DiscoveryService,
  Reflector,
} from '@nestjs/core';

import {
  ScheduledTask,
} from '../decorators/scheduled-task.decorator';

import {
  SchedulerBootstrap,
} from '../providers/scheduler.bootstrap';

import { SchedulerService } from '../services/scheduler.service';

describe('SchedulerBootstrap', () => {
  it('should discover and register decorated scheduled tasks', () => {
    const execute = jest.fn();

    @ScheduledTask(
      'test-task',
      '0 0 * * * *',
    )
    class TestTask {
      execute = execute;
    }

    const instance = new TestTask();

    const discoveryService = {
      getProviders: jest.fn().mockReturnValue([
        {
          instance,
          metatype: TestTask,
        },
      ]),
    } as unknown as DiscoveryService;

    const reflector = new Reflector();

    const schedulerService = {
      schedule: jest.fn(),
    } as unknown as SchedulerService;

    const bootstrap =
      new SchedulerBootstrap(
        discoveryService,
        reflector,
        schedulerService,
      );

    bootstrap.onApplicationBootstrap();

    expect(
      schedulerService.schedule,
    ).toHaveBeenCalledWith(
      'test-task',
      '0 0 * * * *',
      expect.any(Function),
    );
  });
});