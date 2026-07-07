export abstract class ApiResponseDto<T> {
  success: boolean;

  message: string;

  data: T | null;

  timestamp: string;

  constructor(success: boolean, message: string, data: T | null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
