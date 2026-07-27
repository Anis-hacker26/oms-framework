import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

import { Permission } from '../../../common/authorization/enums/permission.enum';
import { Permissions } from '../../../common/authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../common/authorization/guards/permissions.guard';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SuccessMessage } from '../../../common/decorators/success-message.decorator';

import { NotificationMessages } from '../constants/notification.messages';

import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { ListNotificationsDto } from '../dto/list-notifications.dto';
import { MarkNotificationReadDto } from '../dto/mark-notification-read.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';

import { NotificationService } from '../services/notification.service';

@ApiBearerAuth('access-token')
@ApiTags('Notifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Permissions(Permission.NOTIFICATION_CREATE)
  @Post()
  @SuccessMessage(NotificationMessages.CREATED)
  @ApiOperation({
    summary: 'Create Notification',
    description: 'Creates a new notification.',
  })
  @ApiBody({
    type: CreateNotificationDto,
  })
  @ApiCreatedResponse({
    description: NotificationMessages.CREATED,
    type: NotificationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiConflictResponse({
    description: NotificationMessages.NOTIFICATION_ALREADY_EXISTS,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.create(user, dto);
  }

  @Permissions(Permission.NOTIFICATION_READ)
  @Get()
  @SuccessMessage(NotificationMessages.LISTED)
  @ApiOperation({
    summary: 'List Notifications',
    description: 'Returns notifications belonging to the authenticated tenant.',
  })
  @ApiOkResponse({
    description: NotificationMessages.LISTED,
    type: NotificationResponseDto,
    isArray: true,
  })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filters: ListNotificationsDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findAll(user, filters);
  }

  @Permissions(Permission.NOTIFICATION_READ)
  @Get(':id')
  @SuccessMessage(NotificationMessages.RETRIEVED)
  @ApiOperation({
    summary: 'Get Notification',
    description: 'Retrieves a notification by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification UUID',
  })
  @ApiOkResponse({
    description: NotificationMessages.RETRIEVED,
    type: NotificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: NotificationMessages.NOT_FOUND,
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.findById(id);
  }

  @Permissions(Permission.NOTIFICATION_UPDATE)
  @Patch(':id')
  @SuccessMessage(NotificationMessages.UPDATED)
  @ApiOperation({
    summary: 'Update Notification',
    description: 'Updates an existing notification.',
  })
  @ApiOkResponse({
    description: NotificationMessages.UPDATED,
    type: NotificationResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.update(id, user, dto);
  }

  @Permissions(Permission.NOTIFICATION_UPDATE)
  @Patch(':id/read')
  @SuccessMessage(NotificationMessages.READ)
  @ApiOperation({
    summary: 'Mark Notification as Read',
    description: 'Marks a notification as read.',
  })
  @ApiOkResponse({
    description: NotificationMessages.READ,
    type: NotificationResponseDto,
  })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MarkNotificationReadDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.markAsRead(id);
  }

  @Permissions(Permission.NOTIFICATION_DELETE)
  @Delete(':id')
  @SuccessMessage(NotificationMessages.DELETED)
  @ApiOperation({
    summary: 'Archive Notification',
    description: 'Archives a notification.',
  })
  @ApiOkResponse({
    description: NotificationMessages.DELETED,
    type: NotificationResponseDto,
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.delete(id);
  }
}