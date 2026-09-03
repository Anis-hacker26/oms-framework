import { SetMetadata } from '@nestjs/common';

export const EVENT_LISTENER_METADATA = Symbol(
  'EVENT_LISTENER_METADATA',
);

export interface EventListenerOptions {
  priority?: number;
  asynchronous?: boolean;
}

export interface EventListenerMetadata {
  eventName: string;
  priority: number;
  asynchronous: boolean;
}

export function EventListener(
  eventName: string,
  options?: EventListenerOptions,
): ClassDecorator {
  return SetMetadata(
    EVENT_LISTENER_METADATA,
    {
      eventName,
      priority: options?.priority ?? 100,
      asynchronous: options?.asynchronous ?? false,
    } satisfies EventListenerMetadata,
  );
}