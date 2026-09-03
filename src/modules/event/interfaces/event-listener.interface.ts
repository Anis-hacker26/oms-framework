import { DomainEvent } from './domain-event.interface';

export interface EventListener<TEvent extends DomainEvent = DomainEvent> {
  /**
   * Handle a published domain event.
   */
  handle(event: TEvent): Promise<void> | void;
}