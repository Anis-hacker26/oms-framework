import { BaseDomainEvent } from './base-domain.event';

import type { EventContext } from '../interfaces/event-context.interface';
import type { OrderCreatedEventPayload } from '../interfaces/order-created-event-payload.interface';

export class OrderCreatedEvent extends BaseDomainEvent<OrderCreatedEventPayload> {
  constructor(
    payload: OrderCreatedEventPayload,
    context?: EventContext,
  ) {
    super(
      'order.created',
      payload,
      context,
    );
  }
}