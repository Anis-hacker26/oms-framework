import { Injectable, Logger } from '@nestjs/common';

import { ILogger } from './logger.interface';
import { LogEntry } from './log-entry.interface';
import { LogLevel } from './log-level.enum';

@Injectable()
export class AppLoggerService implements ILogger {
  private readonly logger = new Logger('OMS');

  log(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.logger.log(
      this.format({
        level: LogLevel.LOG,
        module,
        event,
        message,
        metadata,
      }),
    );
  }

  warn(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.logger.warn(
      this.format({
        level: LogLevel.WARN,
        module,
        event,
        message,
        metadata,
      }),
    );
  }

  error(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.logger.error(
      this.format({
        level: LogLevel.ERROR,
        module,
        event,
        message,
        metadata,
      }),
    );
  }

  debug(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.logger.debug(
      this.format({
        level: LogLevel.DEBUG,
        module,
        event,
        message,
        metadata,
      }),
    );
  }

  verbose(
    module: string,
    event: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.logger.verbose(
      this.format({
        level: LogLevel.VERBOSE,
        module,
        event,
        message,
        metadata,
      }),
    );
  }

  private format(entry: Omit<LogEntry, 'timestamp'>): string {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(logEntry);
  }
}
