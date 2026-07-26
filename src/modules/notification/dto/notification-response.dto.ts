import { ApiProperty } from '@nestjs/swagger';
import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  Prisma,
} from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  recipientId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({
    enum: NotificationType,
  })
  type: NotificationType;

  @ApiProperty({
    enum: NotificationChannel,
  })
  channel: NotificationChannel;

  @ApiProperty({
    enum: NotificationStatus,
  })
  status: NotificationStatus;

  @ApiProperty({
    required: false,
    type: Object,
  })
  metadata?: Prisma.JsonValue;

  @ApiProperty({
    required: false,
  })
  readAt?: Date | null;

  @ApiProperty({
    required: false,
  })
  archivedAt?: Date | null;

  @ApiProperty({
    required: false,
  })
  createdById?: string | null;

  @ApiProperty({
    required: false,
  })
  updatedById?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  version: number;
}