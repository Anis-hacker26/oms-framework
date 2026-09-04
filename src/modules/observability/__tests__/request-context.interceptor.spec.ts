import {
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';

import { RequestContextInterceptor } from '../interceptors/request-context.interceptor';
import { RequestContextService } from '../services/request-context.service';

describe('RequestContextInterceptor', () => {
  let interceptor: RequestContextInterceptor;
  let requestContextService: RequestContextService;

  beforeEach(() => {
    requestContextService = new RequestContextService();
    interceptor = new RequestContextInterceptor(
      requestContextService,
    );
  });

  function createExecutionContext(
    correlationId?: string,
  ): ExecutionContext {
    const request = {
      header: jest.fn().mockReturnValue(correlationId),
    };

    const response = {
      setHeader: jest.fn(),
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
  }

  it('should preserve an incoming correlation ID', async () => {
    const context =
      createExecutionContext('incoming-correlation-id');

    const next: CallHandler = {
      handle: () => {
        expect(
          requestContextService.getCorrelationId(),
        ).toBe('incoming-correlation-id');

        return of({ success: true });
      },
    };

    const result = await lastValueFrom(
      interceptor.intercept(context, next),
    );

    expect(result).toEqual({ success: true });

    const response = context
      .switchToHttp()
      .getResponse();

    expect(response.setHeader).toHaveBeenCalledWith(
      'x-correlation-id',
      'incoming-correlation-id',
    );
  });

  it('should generate a correlation ID when none is provided', async () => {
    const context = createExecutionContext();

    let correlationId: string | undefined;

    const next: CallHandler = {
      handle: () => {
        correlationId =
          requestContextService.getCorrelationId();

        return of({ success: true });
      },
    };

    await lastValueFrom(
      interceptor.intercept(context, next),
    );

    expect(correlationId).toEqual(expect.any(String));
    expect(correlationId).not.toHaveLength(0);

    const response = context
      .switchToHttp()
      .getResponse();

    expect(response.setHeader).toHaveBeenCalledWith(
      'x-correlation-id',
      correlationId,
    );
  });
});