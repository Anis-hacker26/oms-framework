import { EventService } from '../services/event.service';
import type { DomainEvent } from '../interfaces/domain-event.interface';

describe('EventService', () => {
  it('should publish events through the EventBus', async () => {
    const eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };

    const service = new EventService(eventBus);

const event: DomainEvent = {
  eventId: 'event-001',
  eventName: 'user.registered',
  eventVersion: 1,
  payload: {
    userId: 'user-123',
  },
  occurredAt: new Date(),
};

    await service.publish(event);

    expect(
      eventBus.publish,
    ).toHaveBeenCalledTimes(1);

    expect(
      eventBus.publish,
    ).toHaveBeenCalledWith(event);
  });

  it('should subscribe listeners through the EventBus', () => {
    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };

    const service = new EventService(eventBus);

    const listener = {
      handle: jest.fn(),
    };

    service.subscribe(
      'user.registered',
      listener,
    );

    expect(
      eventBus.subscribe,
    ).toHaveBeenCalledTimes(1);

    expect(
      eventBus.subscribe,
    ).toHaveBeenCalledWith(
      'user.registered',
      listener,
    );
  });

  it('should unsubscribe listeners through the EventBus', () => {
    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };

    const service = new EventService(eventBus);

    const listener = {
      handle: jest.fn(),
    };

    service.unsubscribe(
      'user.registered',
      listener,
    );

    expect(
      eventBus.unsubscribe,
    ).toHaveBeenCalledTimes(1);

    expect(
      eventBus.unsubscribe,
    ).toHaveBeenCalledWith(
      'user.registered',
      listener,
    );
  });
});