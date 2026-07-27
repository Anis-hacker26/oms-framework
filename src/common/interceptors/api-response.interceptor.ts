import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const successMessage =
      this.reflector.get<string>(
        SUCCESS_MESSAGE_KEY,
        context.getHandler(),
      ) ?? 'Request completed successfully.';

    return next.handle().pipe(
      map((response) => {
        // Prevent double wrapping
        if (
          response &&
          typeof response === 'object' &&
          'success' in response &&
          'message' in response &&
          'data' in response
        ) {
          return {
            ...response,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          message: successMessage,
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}