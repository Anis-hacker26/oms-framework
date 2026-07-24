import { Payment } from '@prisma/client';

import { CreatePaymentData } from '../interfaces/create-payment-data.interface';
import { UpdatePaymentData } from '../interfaces/update-payment-data.interface';

export abstract class PaymentRepository {
  abstract create(data: CreatePaymentData): Promise<Payment>;

  abstract findById(id: string): Promise<Payment | null>;

  abstract findByPaymentReference(
    tenantId: string,
    paymentReference: string,
  ): Promise<Payment | null>;

  abstract findAll(tenantId: string): Promise<Payment[]>;

  abstract update(id: string, data: UpdatePaymentData): Promise<Payment>;

  abstract softDelete(id: string): Promise<Payment>;
}
