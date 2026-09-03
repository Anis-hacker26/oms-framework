import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { EVENT_BUS } from './constants/event.constants';
import { EventBootstrap } from './providers/event.bootstrap';
import { InMemoryEventBus } from './providers/in-memory-event-bus.provider';
import { SampleEventListener } from './listeners/sample-event.listener';
import { EventRegistry } from './registry/event.registry';
import { EventService } from './services/event.service';

@Module({
  imports: [
    DiscoveryModule,
  ],

  providers: [
    EventRegistry,

    InMemoryEventBus,

    {
      provide: EVENT_BUS,
      useExisting: InMemoryEventBus,
    },

    EventService,

    EventBootstrap,

    SampleEventListener,
  ],

  exports: [
    EventService,
    EVENT_BUS,
  ],
})
export class EventModule {}