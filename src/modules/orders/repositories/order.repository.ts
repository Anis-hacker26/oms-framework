import { Order } from '@prisma/client';

import { CreateOrderData } from '../interfaces/create-order-data.interface';
import { UpdateOrderData } from '../interfaces/update-order-data.interface';

export abstract class OrderRepository {
  abstract create(data: CreateOrderData): Promise<Order>;

  abstract findById(id: string): Promise<Order | null>;

  abstract findByOrderNumber(
    tenantId: string,
    orderNumber: string,
  ): Promise<Order | null>;

  abstract findAll(tenantId: string): Promise<Order[]>;

  abstract update(id: string, data: UpdateOrderData): Promise<Order>;

  abstract softDelete(id: string): Promise<Order>;
}
