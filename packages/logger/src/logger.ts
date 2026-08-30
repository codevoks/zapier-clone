export type LogContext = Record<string, unknown>

export type Logger = {
  debug: (msg: string, context?: LogContext) => void
  info: (msg: string, context?: LogContext) => void
  warn: (msg: string, context?: LogContext) => void
  error: (msg: string, context?: LogContext) => void
}

type Level = 'debug' | 'info' | 'warn' | 'error'

function serializeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined
  const out: LogContext = {}
  for (const [key, value] of Object.entries(context)) {
    out[key] = value instanceof Error ? { message: value.message, stack: value.stack } : value
  }
  return out
}

function write(service: string, level: Level, msg: string, context?: LogContext) {
  const line = {
    timestamp: new Date().toISOString(),
    level,
    service,
    msg,
    ...serializeContext(context),
  }
  const serialized = JSON.stringify(line)
  if (level === 'error' || level === 'warn') {
    console.error(serialized)
  } else {
    console.log(serialized)
  }
}

/**
 * Minimal structured logger: single-line JSON so log lines for a given
 * zapRunId / eventId can be grepped across services without a log
 * aggregation stack.
 */
export function createLogger(service: string): Logger {
  return {
    debug: (msg, context) => write(service, 'debug', msg, context),
    info: (msg, context) => write(service, 'info', msg, context),
    warn: (msg, context) => write(service, 'warn', msg, context),
    error: (msg, context) => write(service, 'error', msg, context),
  }
}
