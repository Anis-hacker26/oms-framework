import { DomainEvent } from './domain-event.interface';

export interface EventPublisher {
  /**
   * Publish a domain event.
   */
  publish(event: DomainEvent): Promise<void>;
}