jest.mock('@nestjs/schedule', () => ({
  SchedulerRegistry: jest.fn(),
}));

jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation(
    (
      _cronExpression: string,
      onTick: () => Promise<void> | void,
    ) => ({
      start: jest.fn(),
      fireOnTick: jest.fn(async () => {
        await onTick();
      }),
    }),
  ),
}));

import { SchedulerRegistry } from '@nestjs/schedule';

import { NestSchedulerProvider } from '../providers/nest-scheduler.provider';

describe('NestSchedulerProvider', () => {
  let provider: NestSchedulerProvider;

  const schedulerRegistry = {
    addCronJob: jest.fn(),
    deleteCronJob: jest.fn(),
    getCronJob: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    provider = new NestSchedulerProvider(
      schedulerRegistry as unknown as SchedulerRegistry,
    );
  });

  it('should schedule a cron job', () => {
    provider.schedule(
      'test-task',
      '0 0 * * * *',
      jest.fn(),
    );

    expect(
      schedulerRegistry.addCronJob,
    ).toHaveBeenCalledWith(
      'test-task',
      expect.any(Object),
    );
  });

  it('should report a task as scheduled when it exists', () => {
    schedulerRegistry.getCronJob.mockReturnValue(
      {},
    );

    expect(
      provider.isScheduled('test-task'),
    ).toBe(true);

    expect(
      schedulerRegistry.getCronJob,
    ).toHaveBeenCalledWith(
      'test-task',
    );
  });

  it('should report a task as not scheduled when it does not exist', () => {
    schedulerRegistry.getCronJob.mockImplementation(
      () => {
        throw new Error('Cron job not found');
      },
    );

    expect(
      provider.isScheduled('missing-task'),
    ).toBe(false);
  });

  it('should cancel a scheduled task', () => {
    schedulerRegistry.getCronJob.mockReturnValue(
      {},
    );

    provider.cancel('test-task');

    expect(
      schedulerRegistry.deleteCronJob,
    ).toHaveBeenCalledWith(
      'test-task',
    );
  });

  it('should safely cancel a task that does not exist', () => {
    schedulerRegistry.getCronJob.mockImplementation(
      () => {
        throw new Error('Cron job not found');
      },
    );

    expect(() => {
      provider.cancel('missing-task');
    }).not.toThrow();

    expect(
      schedulerRegistry.deleteCronJob,
    ).not.toHaveBeenCalled();
  });

  it('should replace an existing task with the same name', () => {
    schedulerRegistry.getCronJob.mockReturnValue(
      {},
    );

    provider.schedule(
      'test-task',
      '0 0 * * * *',
      jest.fn(),
    );

    provider.schedule(
      'test-task',
      '0 30 * * * *',
      jest.fn(),
    );

    expect(
      schedulerRegistry.deleteCronJob,
    ).toHaveBeenCalledWith(
      'test-task',
    );

    expect(
      schedulerRegistry.addCronJob,
    ).toHaveBeenCalledTimes(2);
  });
});