export class ApiErrorResponseDto {
  success: boolean;

  statusCode: number;

  error: string;

  message: string | string[];

  path: string;

  timestamp: string;

  constructor(
    statusCode: number,
    error: string,
    message: string | string[],
    path: string,
  ) {
    this.success = false;
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    this.path = path;
    this.timestamp = new Date().toISOString();
  }
}
