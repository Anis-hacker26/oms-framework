import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';

import { PrismaService } from '../../../database/prisma/prisma.service';
import { CreateOrderData } from '../interfaces/create-order-data.interface';
import { UpdateOrderData } from '../interfaces/update-order-data.interface';
import { OrderRepository } from './order.repository';

@Injectable()
export class PrismaOrderRepository extends OrderRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  // --------------------------------------------------------------------------
  // Order Management
  // --------------------------------------------------------------------------

  async create(
    data: CreateOrderData,
  ): Promise<Order> {
    return this.prisma.order.create({
      data: {
        tenantId: data.tenantId,
        orderNumber: data.orderNumber,
        title: data.title,
        description: data.description ?? null,
        status: data.status,
        createdById: data.createdById,
        version: data.version ?? 1,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<Order | null> {
    return this.prisma.order.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByOrderNumber(
    tenantId: string,
    orderNumber: string,
  ): Promise<Order | null> {
    return this.prisma.order.findFirst({
      where: {
        tenantId,
        orderNumber,
        deletedAt: null,
      },
    });
  }

  async findAll(
    tenantId: string,
  ): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    data: UpdateOrderData,
  ): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        updatedById: data.updatedById,
        version: data.version,
      },
    });
  }

  async softDelete(
    id: string,
  ): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}