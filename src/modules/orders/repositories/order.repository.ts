import { Order } from '@prisma/client';

import { CreateOrderData } from '../interfaces/create-order-data.interface';
import { OrderListFilters } from '../interfaces/order-list-filters.interface';
import { UpdateOrderData } from '../interfaces/update-order-data.interface';
import { PaginatedResult } from '../../../common/pagination/interfaces/paginated-result.interface';

export abstract class OrderRepository {
  abstract create(data: CreateOrderData): Promise<Order>;

  abstract findById(id: string): Promise<Order | null>;

  abstract findByOrderNumber(
    tenantId: string,
    orderNumber: string,
  ): Promise<Order | null>;

  abstract findAll(
    filters: OrderListFilters,
  ): Promise<PaginatedResult<Order>>;

  abstract update(id: string, data: UpdateOrderData): Promise<Order>;

  abstract softDelete(id: string): Promise<Order>;
}