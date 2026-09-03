import { SchedulerService } from '../services/scheduler.service';

describe('SchedulerService', () => {
  let service: SchedulerService;

  const scheduler = {
    schedule: jest.fn(),
    cancel: jest.fn(),
    isScheduled: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new SchedulerService(
      scheduler,
    );
  });

  it('should delegate schedule to the scheduler', () => {
    const handler = jest.fn();

    service.schedule(
      'test-task',
      '0 0 * * * *',
      handler,
    );

    expect(
      scheduler.schedule,
    ).toHaveBeenCalledWith(
      'test-task',
      '0 0 * * * *',
      handler,
    );
  });

  it('should delegate cancel to the scheduler', () => {
    service.cancel('test-task');

    expect(
      scheduler.cancel,
    ).toHaveBeenCalledWith(
      'test-task',
    );
  });

  it('should delegate isScheduled to the scheduler', () => {
    scheduler.isScheduled.mockReturnValue(
      true,
    );

    expect(
      service.isScheduled('test-task'),
    ).toBe(true);

    expect(
      scheduler.isScheduled,
    ).toHaveBeenCalledWith(
      'test-task',
    );
  });
});