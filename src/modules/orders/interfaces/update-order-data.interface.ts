import { OrderStatus } from '@prisma/client';

export interface UpdateOrderData {
  title?: string;

  description?: string | null;

  status?: OrderStatus;

  updatedById?: string;

  version?: number;
}
