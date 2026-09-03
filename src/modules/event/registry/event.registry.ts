import { Injectable } from '@nestjs/common';

import type { EventListener } from '../interfaces/event-listener.interface';
import type { RegisteredEventListener } from '../interfaces/registered-event-listener.interface';

@Injectable()
export class EventRegistry {
  private readonly listeners = new Map<
    string,
    RegisteredEventListener[]
  >();

  /**
   * Register a listener for an event.
   */
  register(
    eventName: string,
    listener: EventListener,
    priority = 100,
    asynchronous = false,
  ): void {
    const registeredListener: RegisteredEventListener = {
      eventName,
      listener,
      priority,
      asynchronous,
    };

    const listeners =
      this.listeners.get(eventName) ?? [];

    const alreadyRegistered = listeners.some(
      (registered) => registered.listener === listener,
    );

    if (alreadyRegistered) {
      return;
    }

    listeners.push(registeredListener);

    listeners.sort(
      (a, b) => a.priority - b.priority,
    );

    this.listeners.set(eventName, listeners);
  }

  /**
   * Remove a listener from an event.
   */
  unregister(
    eventName: string,
    listener: EventListener,
  ): void {
    const listeners =
      this.listeners.get(eventName);

    if (!listeners) {
      return;
    }

    const filteredListeners = listeners.filter(
      (registered) =>
        registered.listener !== listener,
    );

    if (filteredListeners.length === 0) {
      this.listeners.delete(eventName);
      return;
    }

    this.listeners.set(
      eventName,
      filteredListeners,
    );
  }

  /**
   * Get all listeners registered for an event.
   */
  getListeners(
    eventName: string,
  ): RegisteredEventListener[] {
    return this.listeners.get(eventName) ?? [];
  }

  /**
   * Remove all registered listeners.
   * Useful for testing.
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Check whether an event has listeners.
   */
  hasListeners(
    eventName: string,
  ): boolean {
    return (
      (this.listeners.get(eventName)?.length ?? 0) > 0
    );
  }

  /**
   * Get the total number of listeners
   * registered for an event.
   */
  count(
    eventName: string,
  ): number {
    return this.listeners.get(eventName)?.length ?? 0;
  }
}