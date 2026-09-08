import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppLoggerService } from '../../../common/logging';
import { RequestContextService } from '../services';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly requestContext: RequestContextService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request =
      context.switchToHttp().getRequest<Request>();

    const response =
      context.switchToHttp().getResponse<Response>();

    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logRequest(
          request,
          response,
          startedAt,
          false,
        );
      }),

      catchError((error: unknown) => {
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : response.statusCode;

        this.logRequest(
          request,
          response,
          startedAt,
          true,
          statusCode,
        );

        return throwError(() => error);
      }),
    );
  }

  private logRequest(
    request: Request,
    response: Response,
    startedAt: number,
    isError: boolean,
    errorStatusCode?: number,
  ): void {
    const durationMs = Date.now() - startedAt;

    const route =
      request.route?.path ?? request.path;

    const correlationId =
      this.requestContext.getCorrelationId();

    const metadata = {
      correlationId,
      method: request.method,
      route,
      statusCode:
        errorStatusCode ?? response.statusCode,
      durationMs,
    };

    if (isError) {
      this.logger.error(
        'HTTP',
        'request.failed',
        'HTTP request failed',
        metadata,
      );

      return;
    }

    this.logger.log(
      'HTTP',
      'request.completed',
      'HTTP request completed',
      metadata,
    );
  }
}