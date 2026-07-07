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
import { ApiResponseFactory } from '../api/api-response.factory';
import { ApiSuccessResponseDto } from '../api/api-success-response.dto';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponseDto<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponseDto<T>> {
    const message =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, context.getHandler()) ??
      'Request completed successfully.';

    return next
      .handle()
      .pipe(map((data) => ApiResponseFactory.success(message, data)));
  }
}
