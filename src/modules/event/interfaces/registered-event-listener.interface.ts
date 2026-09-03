import type { EventListener } from './event-listener.interface';

export interface RegisteredEventListener {
  /**
   * Event name handled by the listener.
   */
  eventName: string;

  /**
   * Listener instance.
   */
  listener: EventListener;

  /**
   * Listener execution priority.
   */
  priority: number;

  /**
   * Execute asynchronously.
   */
  asynchronous: boolean;
}