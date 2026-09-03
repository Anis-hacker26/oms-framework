import 'reflect-metadata';

import {
  SCHEDULED_TASK_METADATA,
  ScheduledTask,
} from '../decorators/scheduled-task.decorator';

describe('ScheduledTask decorator', () => {
  it('should store task metadata on the class', () => {
    @ScheduledTask(
      'test-task',
      '0 0 * * * *',
    )
    class TestTask {}

    const metadata = Reflect.getMetadata(
      SCHEDULED_TASK_METADATA,
      TestTask,
    );

    expect(metadata).toEqual({
      taskName: 'test-task',
      cronExpression: '0 0 * * * *',
    });
  });
});