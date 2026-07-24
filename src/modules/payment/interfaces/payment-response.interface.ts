import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface PaymentResponse {
  id: string;

  tenantId: string;

  orderId: string;

  paymentReference: string;

  provider: string;

  method: PaymentMethod;

  currency: string;

  amount: number;

  status: PaymentStatus;

  gatewayTransactionId?: string | null;

  failureReason?: string | null;

  metadata?: Record<string, unknown> | null;

  createdById: string;

  updatedById?: string | null;

  createdAt: Date;

  updatedAt: Date;
}
