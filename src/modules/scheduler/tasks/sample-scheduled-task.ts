import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { ScheduledTask } from '../decorators/scheduled-task.decorator';

@Injectable()
@ScheduledTask(
  'scheduler.health-check',
  '0 */5 * * * *',
)
export class SampleScheduledTask {
  private readonly logger = new Logger(
    SampleScheduledTask.name,
  );

  execute(): void {
    this.logger.log(
      'Scheduler health-check task executed',
    );
  }
}