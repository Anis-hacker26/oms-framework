import { Inject, Injectable } from '@nestjs/common';


import { EVENT_BUS } from '../constants/event.constants';
import type { EventBus } from '../interfaces/event-bus.interface';
import type { DomainEvent } from '../interfaces/domain-event.interface';
import type { EventListener } from '../interfaces/event-listener.interface';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Publish a domain event.
   */
  async publish(event: DomainEvent): Promise<void> {
    await this.eventBus.publish(event);
  }

  /**
   * Register an event listener.
   */
  subscribe(
    eventName: string,
    listener: EventListener,
  ): void {
    this.eventBus.subscribe(eventName, listener);
  }

  /**
   * Remove an event listener.
   */
  unsubscribe(
    eventName: string,
    listener: EventListener,
  ): void {
    this.eventBus.unsubscribe(eventName, listener);
  }
}