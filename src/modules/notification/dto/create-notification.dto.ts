import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { NotificationChannel } from '../enums/notification-channel.enum';
import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';

export class CreateNotificationDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}