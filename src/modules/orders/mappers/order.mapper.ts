import { Order } from '@prisma/client';

import { OrderResponse } from '../interfaces/order-response.interface';

export class OrderMapper {
  static toResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      tenantId: order.tenantId,
      orderNumber: order.orderNumber,
      title: order.title,
      description: order.description,
      status: order.status,
      createdById: order.createdById,
      updatedById: order.updatedById,
      version: order.version,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toResponseList(orders: Order[]): OrderResponse[] {
    return orders.map((order) => OrderMapper.toResponse(order));
  }
}
