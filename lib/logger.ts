/**
 * Production-safe logging utility
 *
 * In development: Logs all messages to console
 * In production: Only logs errors and warnings, no debug/info
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('[Module] Message');
 *   logger.error('[Module] Error:', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  prefix?: string;
  enableInProduction?: boolean;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

/**
 * Safely stringify objects for logging
 */
function safeStringify(obj: unknown): string {
  try {
    if (obj instanceof Error) {
      return `${obj.name}: ${obj.message}${isDevelopment ? `\n${obj.stack}` : ''}`;
    }
    if (typeof obj === 'object' && obj !== null) {
      return JSON.stringify(obj, null, isDevelopment ? 2 : 0);
    }
    return String(obj);
  } catch {
    return '[Unstringifiable Object]';
  }
}

/**
 * Format log message with timestamp
 */
function formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.map(safeStringify).join(' ');
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedArgs ? ' ' + formattedArgs : ''}`;
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, ...args: unknown[]): void {
  // In production, only log errors and warnings
  if (!isDevelopment && !isTest) {
    if (level === 'debug' || level === 'info') {
      return;
    }
  }

  const formattedMessage = formatMessage(level, message, ...args);

  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.debug(formattedMessage);
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(formattedMessage);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(formattedMessage);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(formattedMessage);
      break;
  }
}

/**
 * Logger instance with standard methods
 */
export const logger = {
  /**
   * Debug level - only in development
   */
  debug: (message: string, ...args: unknown[]): void => {
    log('debug', message, ...args);
  },

  /**
   * Info level - only in development
   */
  info: (message: string, ...args: unknown[]): void => {
    log('info', message, ...args);
  },

  /**
   * Warning level - always logged
   */
  warn: (message: string, ...args: unknown[]): void => {
    log('warn', message, ...args);
  },

  /**
   * Error level - always logged
   */
  error: (message: string, ...args: unknown[]): void => {
    log('error', message, ...args);
  },
};

/**
 * Create a namespaced logger for a specific module
 */
export function createLogger(namespace: string): typeof logger {
  return {
    debug: (message: string, ...args: unknown[]) =>
      logger.debug(`[${namespace}] ${message}`, ...args),
    info: (message: string, ...args: unknown[]) =>
      logger.info(`[${namespace}] ${message}`, ...args),
    warn: (message: string, ...args: unknown[]) =>
      logger.warn(`[${namespace}] ${message}`, ...args),
    error: (message: string, ...args: unknown[]) =>
      logger.error(`[${namespace}] ${message}`, ...args),
  };
}

export default logger;
