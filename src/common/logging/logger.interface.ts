export interface ILogger {
  log(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;

  warn(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;

  error(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;

  debug(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;

  verbose(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void;
}
