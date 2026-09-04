import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';

import { CORRELATION_ID_HEADER } from '../constants/observability.constants';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class RequestContextInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly requestContextService: RequestContextService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const incomingCorrelationId =
      request.header(CORRELATION_ID_HEADER);

    const correlationId =
      incomingCorrelationId?.trim() || randomUUID();

    response.setHeader(
      CORRELATION_ID_HEADER,
      correlationId,
    );

    return new Observable((subscriber) => {
      this.requestContextService.run(
        { correlationId },
        () => {
          const subscription = next.handle().subscribe({
            next: (value) => subscriber.next(value),
            error: (error: unknown) =>
              subscriber.error(error),
            complete: () => subscriber.complete(),
          });

          return () => subscription.unsubscribe();
        },
      );
    });
  }
}