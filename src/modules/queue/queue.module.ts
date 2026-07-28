import { Module } from '@nestjs/common';

import { QUEUE_PROVIDER } from './constants/queue.tokens';
import { BullMqProvider } from './providers/bullmq.provider';
import { QueueRegistry } from './registry/queue.registry';
import { QueueService } from './services/queue.service';

@Module({
  providers: [
    QueueRegistry,
    BullMqProvider,
    QueueService,
    {
      provide: QUEUE_PROVIDER,
      useExisting: BullMqProvider,
    },
  ],
  exports: [
    QUEUE_PROVIDER,
    QueueService,
    QueueRegistry,
  ],
})
export class QueueModule {}