import { ApiErrorResponseDto } from './api-error-response.dto';
import { ApiSuccessResponseDto } from './api-success-response.dto';

export class ApiResponseFactory {
  static success<T>(message: string, data: T): ApiSuccessResponseDto<T> {
    return new ApiSuccessResponseDto(message, data);
  }

  static error(
    statusCode: number,
    error: string,
    message: string | string[],
    path: string,
  ): ApiErrorResponseDto {
    return new ApiErrorResponseDto(statusCode, error, message, path);
  }
}
