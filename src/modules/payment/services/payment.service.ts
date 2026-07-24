import { Injectable, NotFoundException } from '@nestjs/common';

import { PaymentMessages } from '../constants/payment.messages';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { CreatePaymentData } from '../interfaces/create-payment-data.interface';
import { PaymentResponse } from '../interfaces/payment-response.interface';
import { UpdatePaymentData } from '../interfaces/update-payment-data.interface';
import { PaymentMapper } from '../mappers/payment.mapper';
import { PaymentRepository } from '../repositories/payment.repository';

import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}
  async create(
    user: AuthenticatedUser,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    const paymentData: CreatePaymentData = {
      tenantId: user.tenantId,
      orderId: createPaymentDto.orderId,
      paymentReference: createPaymentDto.paymentReference,
      provider: createPaymentDto.provider,
      method: createPaymentDto.method,
      currency: createPaymentDto.currency,
      amount: createPaymentDto.amount,
      gatewayTransactionId: createPaymentDto.gatewayTransactionId ?? null,
      metadata: createPaymentDto.metadata ?? null,
      createdById: user.id,
    };

    const payment = await this.paymentRepository.create(paymentData);

    return PaymentMapper.toResponse(payment);
  }
  async findById(id: string): Promise<PaymentResponse> {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundException(PaymentMessages.NOT_FOUND);
    }

    return PaymentMapper.toResponse(payment);
  }
  async findAll(user: AuthenticatedUser): Promise<PaymentResponse[]> {
    const payments = await this.paymentRepository.findAll(user.tenantId);

    return PaymentMapper.toResponseList(payments);
  }
  async update(
    id: string,
    user: AuthenticatedUser,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponse> {
    const existingPayment = await this.paymentRepository.findById(id);

    if (!existingPayment) {
      throw new NotFoundException(PaymentMessages.NOT_FOUND);
    }

    const updateData: UpdatePaymentData = {
      provider: updatePaymentDto.provider,
      method: updatePaymentDto.method,
      currency: updatePaymentDto.currency,
      amount: updatePaymentDto.amount,
      gatewayTransactionId: updatePaymentDto.gatewayTransactionId ?? null,
      failureReason: undefined,
      metadata: updatePaymentDto.metadata ?? null,
      updatedById: user.id,
      version: existingPayment.version + 1,
    };

    const updatedPayment = await this.paymentRepository.update(id, updateData);

    return PaymentMapper.toResponse(updatedPayment);
  }
  async delete(id: string): Promise<PaymentResponse> {
    const existingPayment = await this.paymentRepository.findById(id);

    if (!existingPayment) {
      throw new NotFoundException(PaymentMessages.NOT_FOUND);
    }

    const deletedPayment = await this.paymentRepository.softDelete(id);

    return PaymentMapper.toResponse(deletedPayment);
  }
}
