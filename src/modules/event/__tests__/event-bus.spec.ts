import { InMemoryEventBus } from '../providers/in-memory-event-bus.provider';
import { EventRegistry } from '../registry/event.registry';
import type { DomainEvent } from '../interfaces/domain-event.interface';

describe('InMemoryEventBus', () => {
  let eventBus: InMemoryEventBus;
  let eventRegistry: EventRegistry;

  beforeEach(() => {
    eventRegistry = new EventRegistry();
    eventBus = new InMemoryEventBus(eventRegistry);
  });

  afterEach(() => {
    eventRegistry.clear();
  });

  it('should publish an event to a registered listener', async () => {
    const listener = {
      handle: jest.fn(),
    };

    eventRegistry.register(
      'order.created',
      listener,
    );

   const event: DomainEvent = {
  eventId: 'event-001',
  eventName: 'order.created',
  eventVersion: 1,
  payload: {
    orderId: 'order-123',
  },
  occurredAt: new Date(),
};

    await eventBus.publish(event);

    expect(listener.handle).toHaveBeenCalledTimes(1);
    expect(listener.handle).toHaveBeenCalledWith(event);
  });

  it('should not call listeners registered for another event', async () => {
    const listener = {
      handle: jest.fn(),
    };

    eventRegistry.register(
      'payment.succeeded',
      listener,
    );

const event: DomainEvent = {
  eventId: 'event-002',
  eventName: 'order.created',
  eventVersion: 1,
  payload: {
    orderId: 'order-123',
  },
  occurredAt: new Date(),
};

    await eventBus.publish(event);

    expect(listener.handle).not.toHaveBeenCalled();
  });

  it('should execute synchronous listeners successfully', async () => {
    const firstListener = {
      handle: jest.fn().mockResolvedValue(undefined),
    };

    const secondListener = {
      handle: jest.fn().mockResolvedValue(undefined),
    };

    eventRegistry.register(
      'order.created',
      firstListener,
      100,
      false,
    );

    eventRegistry.register(
      'order.created',
      secondListener,
      200,
      false,
    );

const event: DomainEvent = {
  eventId: 'event-003',
  eventName: 'order.created',
  eventVersion: 1,
  payload: {
    orderId: 'order-123',
  },
  occurredAt: new Date(),
};

    await eventBus.publish(event);

    expect(firstListener.handle).toHaveBeenCalledTimes(1);
    expect(secondListener.handle).toHaveBeenCalledTimes(1);
  });

  it('should continue processing when a listener throws', async () => {
    const failingListener = {
      handle: jest
        .fn()
        .mockRejectedValue(
          new Error('Listener failure'),
        ),
    };

    const successfulListener = {
      handle: jest.fn().mockResolvedValue(undefined),
    };

    eventRegistry.register(
      'order.created',
      failingListener,
      100,
      false,
    );

    eventRegistry.register(
      'order.created',
      successfulListener,
      200,
      false,
    );

const event: DomainEvent = {
  eventId: 'event-004',
  eventName: 'order.created',
  eventVersion: 1,
  payload: {
    orderId: 'order-123',
  },
  occurredAt: new Date(),
};

    await eventBus.publish(event);

    expect(
      failingListener.handle,
    ).toHaveBeenCalledTimes(1);

    expect(
      successfulListener.handle,
    ).toHaveBeenCalledTimes(1);
  });

  it('should subscribe and unsubscribe listeners', async () => {
    const listener = {
      handle: jest.fn(),
    };

    eventBus.subscribe(
      'order.created',
      listener,
    );

    expect(
      eventRegistry.hasListeners('order.created'),
    ).toBe(true);

    eventBus.unsubscribe(
      'order.created',
      listener,
    );

    expect(
      eventRegistry.hasListeners('order.created'),
    ).toBe(false);
  });
});