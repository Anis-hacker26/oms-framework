export interface OrderCreatedEventPayload {
  orderId: string;

  tenantId: string;

  orderNumber: string;

  title: string;

  status: string;

  createdById: string;
}