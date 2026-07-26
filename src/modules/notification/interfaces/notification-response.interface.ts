import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  Prisma,
} from '@prisma/client';

export interface NotificationResponse {
  id: string;
  tenantId: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  metadata?: Prisma.JsonValue;
  readAt?: Date | null;
  archivedAt?: Date | null;
  createdById?: string | null;
  updatedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}