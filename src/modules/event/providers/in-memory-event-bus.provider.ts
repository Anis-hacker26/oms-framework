import { Injectable, Logger } from '@nestjs/common';

import type { EventBus } from '../interfaces/event-bus.interface';
import type { DomainEvent } from '../interfaces/domain-event.interface';
import type { EventListener } from '../interfaces/event-listener.interface';
import { EventRegistry } from '../registry/event.registry';

@Injectable()
export class InMemoryEventBus implements EventBus {
  private readonly logger = new Logger(InMemoryEventBus.name);

  constructor(
    private readonly eventRegistry: EventRegistry,
  ) {}

  /**
   * Publish a domain event.
   */
  async publish(
    event: DomainEvent,
  ): Promise<void> {
    const listeners = this.eventRegistry.getListeners(
      event.eventName,
    );

    for (const registered of listeners) {
      try {
        if (registered.asynchronous) {
          void Promise.resolve(
            registered.listener.handle(event),
          ).catch((error) => {
            this.logger.error(
              `Failed to process async event "${event.eventName}"`,
              error instanceof Error
                ? error.stack
                : undefined,
            );
          });

          continue;
        }

        await registered.listener.handle(event);
      } catch (error) {
        this.logger.error(
          `Failed to process event "${event.eventName}"`,
          error instanceof Error
            ? error.stack
            : undefined,
        );
      }
    }
  }

  /**
   * Register a listener.
   */
  subscribe(
    eventName: string,
    listener: EventListener,
  ): void {
    this.eventRegistry.register(
      eventName,
      listener,
    );
  }

  /**
   * Remove a listener.
   */
  unsubscribe(
    eventName: string,
    listener: EventListener,
  ): void {
    this.eventRegistry.unregister(
      eventName,
      listener,
    );
  }
}