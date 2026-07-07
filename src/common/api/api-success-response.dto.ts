import { ApiResponseDto } from './api-response.dto';

export class ApiSuccessResponseDto<T> extends ApiResponseDto<T> {
  constructor(message: string, data: T) {
    super(true, message, data);
  }
}
