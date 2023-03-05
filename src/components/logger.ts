/**
 * The Logger is an abstraction over native console.X functionality.
 * It's an interface to set a log level, in order to show the desired level
 * of log-types depending on the running environment or requirements.
 * For example in production, you may want to only log INFO, WARN and ERROR
 * types, so your env variable would be LOG_LEVEL=info.
 * 
 * Usage:
 * 
 * Create a logger per module, with a useful name and an optional log level.
 * The default log level comes from process.env if available.
 * Then use it as you'd expect.
 * ```javascript
 * const logger = new Logger('context_middleware', LogLevel.DEBUG);
 * logger.trace('Trace message')
 * logger.debug('Debug message')
 * logger.info('Info message')
 * logger.warn('Warn message')
 * logger.error('Error message')
 * ```
 */
import getConfig from '@/components/getConfig';

const { LOG_LEVEL, NODE_ENV } = getConfig();

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

function logLevelFromEnv(level?: string): LogLevel {
  switch (level?.toLowerCase()) {
    case 'trace': return LogLevel.TRACE;
    case 'debug': return LogLevel.DEBUG;
    case 'info': return LogLevel.INFO;
    case 'warn': return LogLevel.WARN;
    case 'error': return LogLevel.ERROR
    default: return NODE_ENV.toLowerCase() === 'production' ?
      LogLevel.INFO : LogLevel.TRACE;
  }
}

class Logger {
  name: string;
  level: LogLevel;

  constructor(name: string, level?: LogLevel) {
    this.name = name;
    this.level = level || logLevelFromEnv(LOG_LEVEL);
  }

  private log(level: LogLevel, message?: any, ...optionalParams: any[]) {
    if (this.level <= level) {
      const log = {
        level: LogLevel[level],
        service: this.name,
        message: message || '',
        data: optionalParams,
        timestamp: (new Date()).toISOString(),
      };
      console.log(JSON.stringify(log));
    }
  }

  trace(message?: any, ...optionalParams: any[]) {
    this.log(LogLevel.TRACE, message, ...optionalParams);
  }
  debug(message?: any, ...optionalParams: any[]) {
    this.log(LogLevel.DEBUG, message, ...optionalParams);
  }
  info(message?: any, ...optionalParams: any[]) {
    this.log(LogLevel.INFO, message, ...optionalParams);
  }
  warn(message?: any, ...optionalParams: any[]) {
    this.log(LogLevel.WARN, message, ...optionalParams);
  }
  error(message?: any, ...optionalParams: any[]) {
    this.log(LogLevel.ERROR, message, ...optionalParams);
  }
}

export default Logger;
