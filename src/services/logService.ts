import { apiService } from './api';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp?: string;
}

class LogService {
  private static instance: LogService;

  private constructor() {}

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  async log(entry: LogEntry) {
    try {
      const completeEntry: LogEntry = {
        ...entry,
        timestamp: new Date().toISOString()
      };

      // Enviar log al backend
      await apiService.post('/logs', completeEntry);

      // Log local en consola
      this.consoleLog(completeEntry);
    } catch (error) {
      console.error('Error logging:', error);
    }
  }

  private consoleLog(entry: LogEntry) {
    const { level, message, context } = entry;

    switch (level) {
      case LogLevel.ERROR:
        console.error(`[${level}] ${message}`, context);
        break;
      case LogLevel.WARN:
        console.warn(`[${level}] ${message}`, context);
        break;
      case LogLevel.INFO:
        console.info(`[${level}] ${message}`, context);
        break;
      case LogLevel.DEBUG:
        console.debug(`[${level}] ${message}`, context);
        break;
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log({ level: LogLevel.INFO, message, context });
  }

  warn(message: string, context?: Record<string, any>) {
    this.log({ level: LogLevel.WARN, message, context });
  }

  error(message: string, context?: Record<string, any>) {
    this.log({ level: LogLevel.ERROR, message, context });
  }

  debug(message: string, context?: Record<string, any>) {
    this.log({ level: LogLevel.DEBUG, message, context });
  }
}

export const logService = LogService.getInstance();
