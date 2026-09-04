import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

import { RequestContext } from '../interfaces/request-context.interface';

@Injectable()
export class RequestContextService {
  private readonly storage =
    new AsyncLocalStorage<RequestContext>();

  run<T>(
    context: RequestContext,
    callback: () => T,
  ): T {
    return this.storage.run(context, callback);
  }

  get(): RequestContext | undefined {
    return this.storage.getStore();
  }

  getCorrelationId(): string | undefined {
    return this.get()?.correlationId;
  }
}