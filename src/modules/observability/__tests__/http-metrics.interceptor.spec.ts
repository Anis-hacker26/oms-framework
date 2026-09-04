import { ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { HttpMetricsInterceptor } from '../interceptors/http-metrics.interceptor';
import type { Metrics } from '../interfaces';

describe('HttpMetricsInterceptor', () => {
  let interceptor: HttpMetricsInterceptor;
  let metrics: jest.Mocked<Metrics>;

  beforeEach(() => {
    metrics = {
      incrementHttpRequest: jest.fn(),
      incrementHttpError: jest.fn(),
      observeHttpRequestDuration: jest.fn(),
    };

    interceptor = new HttpMetricsInterceptor(metrics);
  });

  function createContext(
    statusCode = 200,
    routePath = '/orders/:id',
  ): ExecutionContext {
    const request = {
      method: 'GET',
      path: '/orders/123',
      route: {
        path: routePath,
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

  it('should record successful HTTP requests', () => {
    const context = createContext(200);
    const next = {
      handle: () => of({ success: true }),
    };

    interceptor.intercept(context, next).subscribe();

    expect(
      metrics.incrementHttpRequest,
    ).toHaveBeenCalledWith({
      method: 'GET',
      route: '/orders/:id',
      statusCode: 200,
    });

    expect(
      metrics.incrementHttpError,
    ).not.toHaveBeenCalled();

    expect(
      metrics.observeHttpRequestDuration,
    ).toHaveBeenCalledWith(
      expect.any(Number),
      {
        method: 'GET',
        route: '/orders/:id',
        statusCode: 200,
      },
    );
  });

  it('should record HTTP errors', () => {
    const context = createContext(404);
    const next = {
      handle: () =>
        throwError(() => new Error('Not found')),
    };

    interceptor
      .intercept(context, next)
      .subscribe({
        error: () => undefined,
      });

    expect(
      metrics.incrementHttpRequest,
    ).toHaveBeenCalledWith({
      method: 'GET',
      route: '/orders/:id',
      statusCode: 404,
    });

    expect(
      metrics.incrementHttpError,
    ).toHaveBeenCalledWith({
      method: 'GET',
      route: '/orders/:id',
      statusCode: 404,
    });

    expect(
      metrics.observeHttpRequestDuration,
    ).toHaveBeenCalledWith(
      expect.any(Number),
      {
        method: 'GET',
        route: '/orders/:id',
        statusCode: 404,
      },
    );
  });

  it('should fall back to request path when route metadata is unavailable', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          path: '/health',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as unknown as ExecutionContext;

    const next = {
      handle: () => of({ status: 'ok' }),
    };

    interceptor.intercept(context, next).subscribe();

    expect(
      metrics.incrementHttpRequest,
    ).toHaveBeenCalledWith({
      method: 'GET',
      route: '/health',
      statusCode: 200,
    });
  });
});