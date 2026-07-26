import { Injectable, NotFoundException } from '@nestjs/common';

import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { NotificationMessages } from '../constants/notification.messages';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { ListNotificationsDto } from '../dto/list-notifications.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { CreateNotificationData } from '../interfaces/create-notification-data.interface';
import { NotificationListFilters } from '../interfaces/notification-list-filters.interface';
import { NotificationResponse } from '../interfaces/notification-response.interface';
import { UpdateNotificationData } from '../interfaces/update-notification-data.interface';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(
    user: AuthenticatedUser,
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationResponse> {
    const notificationData: CreateNotificationData = {
      tenantId: user.tenantId,
      recipientId: createNotificationDto.recipientId,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      type: createNotificationDto.type,
      channel: createNotificationDto.channel,
      status: createNotificationDto.status,
      metadata: createNotificationDto.metadata ?? null,
      createdById: user.id,
    };

    const notification =
      await this.notificationRepository.create(notificationData);

    return NotificationMapper.toResponse(notification);
  }

  async findById(id: string): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException(NotificationMessages.NOT_FOUND);
    }

    return NotificationMapper.toResponse(notification);
  }

  async findAll(
    user: AuthenticatedUser,
    filters: ListNotificationsDto,
  ): Promise<NotificationResponse[]> {
    const listFilters: NotificationListFilters = {
      tenantId: user.tenantId,
      recipientId: filters.recipientId,
      status: filters.status,
      channel: filters.channel,
      type: filters.type,
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    const notifications =
      await this.notificationRepository.findAll(listFilters);

    return NotificationMapper.toResponseList(notifications);
  }

  async update(
    id: string,
    user: AuthenticatedUser,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationResponse> {
    const existingNotification =
      await this.notificationRepository.findById(id);

    if (!existingNotification) {
      throw new NotFoundException(NotificationMessages.NOT_FOUND);
    }

    const updateData: UpdateNotificationData = {
      title: updateNotificationDto.title,
      message: updateNotificationDto.message,
      type: updateNotificationDto.type,
      channel: updateNotificationDto.channel,
      status: updateNotificationDto.status,
      metadata: updateNotificationDto.metadata ?? null,
      updatedById: user.id,
      version: existingNotification.version + 1,
    };

    const notification = await this.notificationRepository.update(
      id,
      updateData,
    );

    return NotificationMapper.toResponse(notification);
  }

  async markAsRead(
  id: string,
): Promise<NotificationResponse> {
    const existingNotification =
  await this.getNotificationOrThrow(id);

    const notification = await this.notificationRepository.markAsRead(
  id,
  existingNotification.version + 1,
);

    return NotificationMapper.toResponse(notification);
  }

  private async getNotificationOrThrow(id: string) {
  const notification = await this.notificationRepository.findById(id);

  if (!notification) {
    throw new NotFoundException(NotificationMessages.NOT_FOUND);
  }

  return notification;
}

  async delete(id: string): Promise<NotificationResponse> {
    const existingNotification =
      await this.notificationRepository.findById(id);

    if (!existingNotification) {
      throw new NotFoundException(NotificationMessages.NOT_FOUND);
    }

    const notification = await this.notificationRepository.archive(id);

    return NotificationMapper.toResponse(notification);
  }
}