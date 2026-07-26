import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@prisma/client';

export interface NotificationListFilters {
  tenantId: string;

  recipientId?: string;

  status?: NotificationStatus;

  channel?: NotificationChannel;

  type?: NotificationType;

  search?: string;

  page: number;

  limit: number;

  sortBy: string;

  sortOrder: 'asc' | 'desc';
}