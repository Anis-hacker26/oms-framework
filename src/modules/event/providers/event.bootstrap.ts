import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  DiscoveryService,
  Reflector,
} from '@nestjs/core';

import {
  EVENT_LISTENER_METADATA,
} from '../decorators/event-listener.decorator';

import type {
  EventListenerMetadata,
} from '../decorators/event-listener.decorator';

import type {
  EventListener,
} from '../interfaces/event-listener.interface';

import { EventRegistry } from '../registry/event.registry';

@Injectable()
export class EventBootstrap
  implements OnApplicationBootstrap
{
  private readonly logger = new Logger(
    EventBootstrap.name,
  );

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly eventRegistry: EventRegistry,
  ) {}

  onApplicationBootstrap(): void {
    this.registerEventListeners();
  }

  /**
   * Discover providers decorated with @EventListener()
   * and register them with the EventRegistry.
   */
  private registerEventListeners(): void {
    const providers =
      this.discoveryService.getProviders();

    let registeredCount = 0;

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;

      if (!instance || !metatype) {
        continue;
      }

      const metadata =
        this.reflector.get<EventListenerMetadata>(
          EVENT_LISTENER_METADATA,
          metatype,
        );

      if (!metadata) {
        continue;
      }

      const listener =
        instance as EventListener;

      this.eventRegistry.register(
        metadata.eventName,
        listener,
        metadata.priority,
        metadata.asynchronous,
      );

      registeredCount++;

      this.logger.log(
        `Registered listener "${metatype.name}" for event "${metadata.eventName}"`,
      );
    }

    this.logger.log(
      `Event listener discovery completed: ${registeredCount} listener(s) registered`,
    );
  }
}