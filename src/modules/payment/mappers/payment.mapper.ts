import { Payment } from '@prisma/client';

import { PaymentResponse } from '../interfaces/payment-response.interface';

export class PaymentMapper {
  static toResponse(payment: Payment): PaymentResponse {
    return {
      id: payment.id,

      tenantId: payment.tenantId,

      orderId: payment.orderId,

      paymentReference: payment.paymentReference,

      provider: payment.provider,

      method: payment.method,

      currency: payment.currency,

      amount: Number(payment.amount),

      status: payment.status,

      gatewayTransactionId: payment.gatewayTransactionId,

      failureReason: payment.failureReason,

      metadata: payment.metadata as Record<string, unknown> | null,

      createdById: payment.createdById,

      updatedById: payment.updatedById,

      createdAt: payment.createdAt,

      updatedAt: payment.updatedAt,
    };
  }

  static toResponseList(payments: Payment[]): PaymentResponse[] {
    return payments.map((payment) => this.toResponse(payment));
  }
}
