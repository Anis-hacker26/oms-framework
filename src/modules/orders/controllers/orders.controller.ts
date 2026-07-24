import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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
import { ParseUUIDPipe } from '@nestjs/common';

import { Permission } from '../../../common/authorization/enums/permission.enum';
import { Permissions } from '../../../common/authorization/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../common/authorization/guards/permissions.guard';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SuccessMessage } from '../../../common/decorators/success-message.decorator';

import { OrderMessages } from '../constants/order.messages';

import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';

import { OrdersService } from '../services/orders.service';

@ApiBearerAuth('access-token')
@ApiTags('Orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Permissions(Permission.ORDER_CREATE)
  @Post()
  @SuccessMessage(OrderMessages.CREATED)
  @ApiOperation({
    summary: 'Create Order',
    description: 'Creates a new order.',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation request.',
  })
  @ApiCreatedResponse({
    description: OrderMessages.CREATED,
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed. One or more request fields are invalid.',
  })
  @ApiConflictResponse({
    description: OrderMessages.ORDER_NUMBER_EXISTS,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.create(user, createOrderDto);
  }

  @Permissions(Permission.ORDER_READ)
  @Get()
  @SuccessMessage(OrderMessages.LISTED)
  @ApiOperation({
    summary: 'List Orders',
    description: 'Returns all orders belonging to the authenticated tenant.',
  })
  @ApiOkResponse({
    description: OrderMessages.LISTED,
    type: OrderResponseDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll(user);
  }

  @Permissions(Permission.ORDER_READ)
  @Get(':id')
  @SuccessMessage(OrderMessages.RETRIEVED)
  @ApiOperation({
    summary: 'Get Order by ID',
    description: 'Retrieves an order using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiOkResponse({
    description: OrderMessages.RETRIEVED,
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid order ID.',
  })
  @ApiNotFoundResponse({
    description: OrderMessages.NOT_FOUND,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.ordersService.findById(id);
  }

  @Permissions(Permission.ORDER_UPDATE)
  @Patch(':id')
  @SuccessMessage(OrderMessages.UPDATED)
  @ApiOperation({
    summary: 'Update Order',
    description:
      'Updates an existing order. Only supplied fields will be modified.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Fields to update.',
  })
  @ApiOkResponse({
    description: OrderMessages.UPDATED,
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid order ID or request payload.',
  })
  @ApiConflictResponse({
    description: OrderMessages.ORDER_NUMBER_EXISTS,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  @ApiNotFoundResponse({
    description: OrderMessages.NOT_FOUND,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.update(id, user, updateOrderDto);
  }

  @Permissions(Permission.ORDER_DELETE)
  @Delete(':id')
  @SuccessMessage(OrderMessages.DELETED)
  @ApiOperation({
    summary: 'Delete Order',
    description: 'Soft deletes an existing order.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiOkResponse({
    description: OrderMessages.DELETED,
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid order ID.',
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  @ApiNotFoundResponse({
    description: OrderMessages.NOT_FOUND,
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.ordersService.delete(id);
  }
}
