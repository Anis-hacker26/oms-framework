import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface PaymentSucceededEventPayload {
  paymentId: string;
  tenantId: string;
  orderId: string;
  paymentReference: string;
  provider: string;
  method: PaymentMethod;
  currency: string;
  amount: number;
  status: PaymentStatus;
  gatewayTransactionId: string | null;
}