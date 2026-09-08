import { OrderStatus } from '../enums/order-status.enum';

export interface OrderListFilters {
  tenantId: string;
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus;
}