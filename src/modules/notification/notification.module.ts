import { Module } from '@nestjs/common';

import { NotificationController } from './controllers/notification.controller';
import { NotificationMapper } from './mappers/notification.mapper';
import { NotificationRepository } from './repositories/notification.repository';
import { PrismaNotificationRepository } from './repositories/prisma-notification.repository';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationMapper,
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}