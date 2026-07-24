import { OrderStatus } from '@prisma/client';

export interface OrderResponse {
  id: string;

  tenantId: string;

  orderNumber: string;

  title: string;
  description: string | null;

  status: OrderStatus;

  createdById: string;
  updatedById: string | null;

  version: number;

  createdAt: Date;
  updatedAt: Date;
}
