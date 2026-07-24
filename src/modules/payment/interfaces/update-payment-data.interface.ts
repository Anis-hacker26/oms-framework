import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface UpdatePaymentData {
  provider?: string;

  method?: PaymentMethod;

  currency?: string;

  amount?: number;

  status?: PaymentStatus;

  gatewayTransactionId?: string | null;

  failureReason?: string | null;

  metadata?: Record<string, unknown> | null;

  updatedById: string;

  version: number;
}
