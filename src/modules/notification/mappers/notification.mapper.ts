import { Notification } from '@prisma/client';

export class NotificationMapper {
  static toResponse(notification: Notification) {
    return {
      id: notification.id,
      tenantId: notification.tenantId,
      recipientId: notification.recipientId,

      title: notification.title,
      message: notification.message,

      type: notification.type,
      channel: notification.channel,
      status: notification.status,

      metadata: notification.metadata,

      readAt: notification.readAt,
      archivedAt: notification.archivedAt,

      createdById: notification.createdById,
      updatedById: notification.updatedById,

      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,

      version: notification.version,
    };
  }

  static toResponseList(notifications: Notification[]) {
    return notifications.map((notification) =>
      NotificationMapper.toResponse(notification),
    );
  }
}