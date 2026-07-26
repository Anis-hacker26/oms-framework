import { Notification } from '@prisma/client';

import { CreateNotificationData } from '../interfaces/create-notification-data.interface';
import { NotificationListFilters } from '../interfaces/notification-list-filters.interface';
import { UpdateNotificationData } from '../interfaces/update-notification-data.interface';

export abstract class NotificationRepository {
  abstract create(data: CreateNotificationData): Promise<Notification>;

  abstract findById(id: string): Promise<Notification | null>;

  abstract findAll(
    filters: NotificationListFilters,
  ): Promise<Notification[]>;

  abstract update(
    id: string,
    data: UpdateNotificationData,
  ): Promise<Notification>;

  abstract markAsRead(
    id: string,
    version: number,
  ): Promise<Notification>;

  abstract archive(id: string): Promise<Notification>;

  abstract exists(id: string): Promise<boolean>;
}