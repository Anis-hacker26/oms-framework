import { Payment } from '@prisma/client';

import { CreatePaymentData } from '../interfaces/create-payment-data.interface';
import { PaymentListFilters } from '../interfaces/payment-list-filters.interface';
import { UpdatePaymentData } from '../interfaces/update-payment-data.interface';

import { PaginatedResult } from '../../../common/pagination/interfaces/paginated-result.interface';

export abstract class PaymentRepository {
  abstract create(data: CreatePaymentData): Promise<Payment>;

  abstract findById(id: string): Promise<Payment | null>;

  abstract findByPaymentReference(
    tenantId: string,
    paymentReference: string,
  ): Promise<Payment | null>;

  abstract findAll(
  filters: PaymentListFilters,
): Promise<PaginatedResult<Payment>>;

  abstract update(id: string, data: UpdatePaymentData): Promise<Payment>;

  abstract softDelete(id: string): Promise<Payment>;
}
