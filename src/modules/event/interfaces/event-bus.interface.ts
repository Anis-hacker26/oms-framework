import { DomainEvent } from './domain-event.interface';
import { EventListener } from './event-listener.interface';

export interface EventBus {
  /**
   * Publish a domain event.
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Subscribe a listener to an event.
   */
  subscribe(
    eventName: string,
    listener: EventListener,
  ): void;

  /**
   * Remove a listener from an event.
   */
  unsubscribe(
    eventName: string,
    listener: EventListener,
  ): void;
}