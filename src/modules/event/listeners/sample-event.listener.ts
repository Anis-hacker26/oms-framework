import { Injectable, Logger } from '@nestjs/common';

import { EventListener } from '../decorators/event-listener.decorator';
import type { EventListener as EventListenerContract } from '../interfaces/event-listener.interface';
import type { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
@EventListener('order.created', {
  priority: 100,
  asynchronous: false,
})
export class SampleEventListener
  implements EventListenerContract<OrderCreatedEvent>
{
  private readonly logger = new Logger(
    SampleEventListener.name,
  );

  handle(event: OrderCreatedEvent): void {
    this.logger.log(
      `Order created event received: ${event.eventId}`,
    );
  }
}