import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@prisma/client';

export interface CreateNotificationData {
  tenantId: string;

  recipientId: string;

  title: string;

  message: string;

  type: NotificationType;

  channel: NotificationChannel;

  status?: NotificationStatus;

  metadata?: Record<string, unknown> | null;

  createdById?: string | null;
}