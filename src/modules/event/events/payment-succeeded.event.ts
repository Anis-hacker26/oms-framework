import { BaseDomainEvent } from './base-domain.event';

import type { EventContext } from '../interfaces/event-context.interface';
import type { PaymentSucceededEventPayload } from '../interfaces/payment-succeeded-event-payload.interface';

export class PaymentSucceededEvent
  extends BaseDomainEvent<PaymentSucceededEventPayload>
{
  constructor(
    payload: PaymentSucceededEventPayload,
    context?: EventContext,
  ) {
    super(
      'payment.succeeded',
      payload,
      context,
    );
  }
}