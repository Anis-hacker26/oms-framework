import { OrderStatus } from '@prisma/client';

export interface CreateOrderData {
  tenantId: string;

  orderNumber: string;

  title: string;
  description?: string | null;

  status: OrderStatus;

  createdById: string;

  version?: number;
}