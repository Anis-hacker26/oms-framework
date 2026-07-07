import { LogLevel } from './log-level.enum';

export interface LogEntry {
  level: LogLevel;
  module: string;
  event: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
