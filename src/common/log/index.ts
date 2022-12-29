// @ts-ignore
import pino, { LogFn, Logger } from 'pino'
import { isDevelopment, isProduction } from '../environments'

export type LogContext = { [key: string]: string | number | boolean }

export interface ContextLogger {
  baseLogger: Logger
  trace: LogFn
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
  addContext: (context: LogContext, next: () => any) => Promise<void>
  // addContext: (context: { [key: string]: string | number }, next: () => any) => Promise<void>,
  getContext: () => any
  updateContext: (context: any) => void
  removeContext: (props?: string | string[]) => void
}

function getLoggingLevel() {
  if (process.env.NODE_ENV === 'silent') {
    return 'silent'
  }
  return !isProduction() ? 'trace' : 'debug'
}

const logger = pino({
  timestamp: isDevelopment(),
  messageKey: 'message',
  level: getLoggingLevel(),
  prettyPrint: isDevelopment() ? { colorize: true } : false
})

export const createLogger = (module: string, props?: object): ContextLogger => {
  const baseLogger = logger.child({ module, ...props })

  // if I change this to require only client logger to bug does not occur
  return require('os').platform() === 'browser'
    ? require('./client-logger').getLogger(baseLogger)
    : baseLogger
}