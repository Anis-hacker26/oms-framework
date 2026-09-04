import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

import { METRICS } from '../constants/observability.constants';
import type { Metrics } from '../interfaces';

@Injectable()
export class HttpMetricsInterceptor
  implements NestInterceptor
{
constructor(
  @Inject(METRICS)
  private readonly metrics: Metrics,
) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.recordMetrics(
            request,
            response,
            startedAt,
          );
        },
        error: () => {
          this.recordMetrics(
            request,
            response,
            startedAt,
          );
        },
      }),
    );
  }

  private recordMetrics(
    request: Request,
    response: Response,
    startedAt: number,
  ): void {
    const statusCode = response.statusCode;

    const labels = {
      method: request.method,
      route: this.getRoute(request),
      statusCode,
    };

    this.metrics.incrementHttpRequest(labels);

    if (statusCode >= 400) {
      this.metrics.incrementHttpError(labels);
    }

    this.metrics.observeHttpRequestDuration(
      Date.now() - startedAt,
      labels,
    );
  }

  private getRoute(request: Request): string {
    return request.route?.path ?? request.path;
  }
}