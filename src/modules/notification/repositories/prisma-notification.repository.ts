import { Injectable } from '@nestjs/common';
import { Notification, NotificationStatus ,Prisma } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';

import { CreateNotificationData } from '../interfaces/create-notification-data.interface';
import { NotificationListFilters } from '../interfaces/notification-list-filters.interface';
import { UpdateNotificationData } from '../interfaces/update-notification-data.interface';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class PrismaNotificationRepository extends NotificationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateNotificationData): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        tenantId: data.tenantId,
        recipientId: data.recipientId,
        title: data.title,
        message: data.message,
        type: data.type,
        channel: data.channel,
        status: data.status,
        metadata: data.metadata as Prisma.InputJsonValue,
        createdById: data.createdById,
      },
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findFirst({
      where: {
        id,
        archivedAt: null,
      },
    });
  }

  async findAll(
    filters: NotificationListFilters,
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        tenantId: filters.tenantId,
        archivedAt: null,

        recipientId: filters.recipientId,
        status: filters.status,
        channel: filters.channel,
        type: filters.type,

        ...(filters.search && {
          OR: [
            {
              title: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
            {
              message: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },

      orderBy: {
        [filters.sortBy]: filters.sortOrder,
      },

      skip: (filters.page - 1) * filters.limit,

      take: filters.limit,
    });
  }

  async update(
    id: string,
    data: UpdateNotificationData,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        channel: data.channel,
        status: data.status,
        metadata: data.metadata as Prisma.InputJsonValue,
        updatedById: data.updatedById,
        version: data.version,
      },
    });
  }

  async markAsRead(
    id: string,
    version: number,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
  status: NotificationStatus.READ,
  readAt: new Date(),
  version,
},
    });
  }

  async archive(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        archivedAt: new Date(),
        version: {
          increment: 1,
        },
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    return !!notification;
  }
} 