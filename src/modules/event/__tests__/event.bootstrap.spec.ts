import { Test } from '@nestjs/testing';
import { DiscoveryService, Reflector } from '@nestjs/core';

import { EventBootstrap } from '../providers/event.bootstrap';
import { EventRegistry } from '../registry/event.registry';
import { SampleEventListener } from '../listeners/sample-event.listener';

describe('EventBootstrap', () => {
  let bootstrap: EventBootstrap;
  let registry: EventRegistry;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EventRegistry,
        EventBootstrap,
        SampleEventListener,
        DiscoveryService,
        Reflector,
      ],
    }).compile();

    bootstrap = moduleRef.get(EventBootstrap);
    registry = moduleRef.get(EventRegistry);
  });

  it('should automatically discover and register decorated listeners', () => {
    bootstrap.onApplicationBootstrap();

    expect(
      registry.hasListeners('order.created'),
    ).toBe(true);

    expect(
      registry.count('order.created'),
    ).toBe(1);

    const listeners =
      registry.getListeners('order.created');

    expect(listeners[0].listener).toBeInstanceOf(
      SampleEventListener,
    );
  });

  it('should preserve listener metadata during registration', () => {
    bootstrap.onApplicationBootstrap();

    const listeners =
      registry.getListeners('order.created');

    expect(listeners[0]).toMatchObject({
      eventName: 'order.created',
      priority: 100,
      asynchronous: false,
    });
  });
});