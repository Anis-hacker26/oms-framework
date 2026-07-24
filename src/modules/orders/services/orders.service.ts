import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { OrderMessages } from '../constants/order.messages';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CreateOrderData } from '../interfaces/create-order-data.interface';
import { OrderResponse } from '../interfaces/order-response.interface';
import { UpdateOrderData } from '../interfaces/update-order-data.interface';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderRepository } from '../repositories/order.repository';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(
    user: AuthenticatedUser,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponse> {
    const orderData: CreateOrderData = {
      tenantId: user.tenantId,
      orderNumber: this.generateOrderNumber(),
      title: createOrderDto.title,
      description: createOrderDto.description ?? null,
      status: createOrderDto.status ?? OrderStatus.DRAFT,
      createdById: user.id,
      version: 1,
    };

    const order = await this.orderRepository.create(orderData);

    return OrderMapper.toResponse(order);
  }

  async findById(id: string): Promise<OrderResponse> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException(OrderMessages.NOT_FOUND);
    }

    return OrderMapper.toResponse(order);
  }

  async findAll(user: AuthenticatedUser): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.findAll(user.tenantId);

    return OrderMapper.toResponseList(orders);
  }

  async update(
    id: string,
    user: AuthenticatedUser,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponse> {
    const existingOrder = await this.orderRepository.findById(id);

    if (!existingOrder) {
      throw new NotFoundException(OrderMessages.NOT_FOUND);
    }

    const updateData: UpdateOrderData = {
      title: updateOrderDto.title,
      description: updateOrderDto.description ?? null,
      status: updateOrderDto.status,
      updatedById: user.id,
      version: existingOrder.version + 1,
    };

    const updatedOrder = await this.orderRepository.update(id, updateData);

    return OrderMapper.toResponse(updatedOrder);
  }

  async delete(id: string): Promise<OrderResponse> {
    const existingOrder = await this.orderRepository.findById(id);

    if (!existingOrder) {
      throw new NotFoundException(OrderMessages.NOT_FOUND);
    }

    const deletedOrder = await this.orderRepository.softDelete(id);

    return OrderMapper.toResponse(deletedOrder);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    return `ORD-${timestamp}-${random}`;
  }
}
