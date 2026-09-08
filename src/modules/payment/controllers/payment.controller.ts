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

import { PaymentMessages } from '../constants/payment.messages';


import { ListPaymentsDto } from '../dto/list-payments.dto';
import { PageDto } from '../../../common/pagination/dto/page.dto';
import { PaymentResponse } from '../interfaces/payment-response.interface';

import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';

import { PaymentService } from '../services/payment.service';

@ApiBearerAuth('access-token')
@ApiTags('Payments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Permissions(Permission.PAYMENT_CREATE)
  @Post()
  @SuccessMessage(PaymentMessages.CREATED)
  @ApiOperation({
    summary: 'Create Payment',
    description: 'Creates a new payment.',
  })
  @ApiBody({
    type: CreatePaymentDto,
    description: 'Payment creation request.',
  })
  @ApiCreatedResponse({
    description: PaymentMessages.CREATED,
    type: PaymentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed. One or more request fields are invalid.',
  })
  @ApiConflictResponse({
    description: PaymentMessages.PAYMENT_ALREADY_EXISTS,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.create(user, createPaymentDto);
  }

  @Permissions(Permission.PAYMENT_READ)
  @Get()
  @SuccessMessage(PaymentMessages.LISTED)
  @ApiOperation({
    summary: 'List Payments',
    description: 'Returns all payments belonging to the authenticated tenant.',
  })
  @ApiOkResponse({
    description: PaymentMessages.LISTED,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() listPaymentsDto: ListPaymentsDto,
  ): Promise<PageDto<PaymentResponse>> {
    return this.paymentService.findAll(user, listPaymentsDto);
  }

  @Permissions(Permission.PAYMENT_READ)
  @Get(':id')
  @SuccessMessage(PaymentMessages.RETRIEVED)
  @ApiOperation({
    summary: 'Get Payment by ID',
    description: 'Retrieves a payment using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiOkResponse({
    description: PaymentMessages.RETRIEVED,
    type: PaymentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payment ID.',
  })
  @ApiNotFoundResponse({
    description: PaymentMessages.NOT_FOUND,
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.findById(id);
  }

  @Permissions(Permission.PAYMENT_UPDATE)
  @Patch(':id')
  @SuccessMessage(PaymentMessages.UPDATED)
  @ApiOperation({
    summary: 'Update Payment',
    description: 'Updates an existing payment.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiBody({
    type: UpdatePaymentDto,
    description: 'Fields to update.',
  })
  @ApiOkResponse({
    description: PaymentMessages.UPDATED,
    type: PaymentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payment ID or request payload.',
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  @ApiNotFoundResponse({
    description: PaymentMessages.NOT_FOUND,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.update(id, user, updatePaymentDto);
  }

  @Permissions(Permission.PAYMENT_DELETE)
  @Delete(':id')
  @SuccessMessage(PaymentMessages.DELETED)
  @ApiOperation({
    summary: 'Delete Payment',
    description: 'Soft deletes an existing payment.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment UUID',
    example: 'c9a4a5b5-8c65-47a2-8ef9-d3e0d9b66d51',
  })
  @ApiOkResponse({
    description: PaymentMessages.DELETED,
    type: PaymentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payment ID.',
  })
  @ApiForbiddenResponse({
    description: 'You do not have permission to perform this action.',
  })
  @ApiNotFoundResponse({
    description: PaymentMessages.NOT_FOUND,
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.delete(id);
  }
}
