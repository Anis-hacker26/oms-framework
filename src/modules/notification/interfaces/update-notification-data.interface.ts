import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@prisma/client';

export interface UpdateNotificationData {
  title?: string;

  message?: string;

  type?: NotificationType;

  channel?: NotificationChannel;

  status?: NotificationStatus;

  metadata?: Record<string, unknown> | null;

  readAt?: Date | null;

  archivedAt?: Date | null;

  updatedById?: string | null;

  version: number;
}