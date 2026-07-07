import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { ApiResponseFactory } from '../api/api-response.factory';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let error = 'Internal Server Error';

    let message: string | string[] = 'Something went wrong.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseBody = exceptionResponse as Record<string, unknown>;

        error = (responseBody.error as string) ?? error;

        message = (responseBody.message as string | string[]) ?? message;
      }
    }

    response
      .status(status)
      .json(ApiResponseFactory.error(status, error, message, request.url));
  }
}
