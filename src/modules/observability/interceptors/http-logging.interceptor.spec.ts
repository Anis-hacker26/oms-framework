import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { AppLoggerService } from '../../../common/logging';
import { RequestContextService } from '../services';
import { HttpLoggingInterceptor } from './http-logging.interceptor';

describe('HttpLoggingInterceptor', () => {
  let interceptor: HttpLoggingInterceptor;
  let logger: jest.Mocked<AppLoggerService>;
  let requestContext: jest.Mocked<RequestContextService>;

  beforeEach(() => {
    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<AppLoggerService>;

    requestContext = {
      get: jest.fn(),
      getCorrelationId: jest.fn().mockReturnValue('test-correlation-id'),
      run: jest.fn(),
    } as unknown as jest.Mocked<RequestContextService>;

    interceptor = new HttpLoggingInterceptor(
      logger,
      requestContext,
    );
  });

  function createContext(
    statusCode: number,
    route = '/orders/:id',
  ): ExecutionContext {
    const request = {
      method: 'GET',
      path: '/orders/123',
      route: {
        path: route,
      },
    };

    const response = {
      statusCode,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
  }

  it('should log a successful HTTP request', () => {
    const context = createContext(200);
    const next: CallHandler = {
      handle: () => of({ success: true }),
    };

    interceptor.intercept(context, next).subscribe();

    expect(logger.log).toHaveBeenCalledWith(
      'HTTP',
      'request.completed',
      'HTTP request completed',
      expect.objectContaining({
        correlationId: 'test-correlation-id',
        method: 'GET',
        route: '/orders/:id',
        statusCode: 200,
        durationMs: expect.any(Number),
      }),
    );

    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should log a failed HTTP request', () => {
    const context = createContext(500);
    const error = new Error('request failed');

    const next: CallHandler = {
      handle: () => throwError(() => error),
    };

    interceptor.intercept(context, next).subscribe({
      error: (receivedError) => {
        expect(receivedError).toBe(error);
      },
    });

    expect(logger.error).toHaveBeenCalledWith(
      'HTTP',
      'request.failed',
      'HTTP request failed',
      expect.objectContaining({
        correlationId: 'test-correlation-id',
        method: 'GET',
        route: '/orders/:id',
        statusCode: 500,
        durationMs: expect.any(Number),
      }),
    );
  });

  it('should fall back to request path when route metadata is unavailable', () => {
    const request = {
      method: 'GET',
      path: '/health',
    };

    const response = {
      statusCode: 200,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ status: 'ok' }),
    };

    interceptor.intercept(context, next).subscribe();

    expect(logger.log).toHaveBeenCalledWith(
      'HTTP',
      'request.completed',
      'HTTP request completed',
      expect.objectContaining({
        route: '/health',
      }),
    );
  });
});