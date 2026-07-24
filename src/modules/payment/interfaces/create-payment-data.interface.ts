import { PaymentMethod } from '@prisma/client';

export interface CreatePaymentData {
  tenantId: string;

  orderId: string;

  paymentReference: string;

  provider: string;

  method: PaymentMethod;

  currency: string;

  amount: number;

  gatewayTransactionId?: string | null;

  metadata?: Record<string, unknown> | null;

  createdById: string;
}
