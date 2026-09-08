import { Injectable } from '@nestjs/common';
import { Payment, Prisma } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { CreatePaymentData } from '../interfaces/create-payment-data.interface';
import { UpdatePaymentData } from '../interfaces/update-payment-data.interface';
import { PaymentRepository } from './payment.repository';
import { PaymentListFilters } from '../interfaces/payment-list-filters.interface';
import { PaginatedResult } from '../../../common/pagination/interfaces/paginated-result.interface';

@Injectable()
export class PrismaPaymentRepository extends PaymentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        tenantId: data.tenantId,
        orderId: data.orderId,
        paymentReference: data.paymentReference,
        provider: data.provider,
        method: data.method,
        currency: data.currency,
        amount: new Prisma.Decimal(data.amount),
        gatewayTransactionId: data.gatewayTransactionId,
        metadata: data.metadata as Prisma.InputJsonValue,
        createdById: data.createdById,
      },
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByPaymentReference(
    tenantId: string,
    paymentReference: string,
  ): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: {
        tenantId,
        paymentReference,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    data: UpdatePaymentData,
  ): Promise<Payment> {
    return this.prisma.payment.update({
      where: {
        id,
      },
      data: {
  provider: data.provider,
  method: data.method,
  currency: data.currency,
  amount:
    data.amount !== undefined
      ? new Prisma.Decimal(data.amount)
      : undefined,
  status: data.status,
  gatewayTransactionId: data.gatewayTransactionId,
  failureReason: data.failureReason,
  metadata: data.metadata as Prisma.InputJsonValue,
  updatedById: data.updatedById,
  version: data.version,
    },
    });
  }

  async softDelete(id: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        version: {
          increment: 1,
        },
      },
    });
  }

async findAll(
  filters: PaymentListFilters,
): Promise<PaginatedResult<Payment>> {
  const { tenantId, page, limit } = filters;

  const where = {
    tenantId,
    deletedAt: null,
  };

  const [items, totalItems] = await Promise.all([
    this.prisma.payment.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.payment.count({
      where,
    }),
  ]);

  return {
    items,
    totalItems,
  };
}
}