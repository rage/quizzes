import { randomUUID } from "crypto"

import { DatabaseError } from "pg"
import winston, { format } from "winston"

import { CustomContext } from "../types"

const myFormat = format.printf(
  ({ level, message, timestamp, requestId, stack, ...metadata }) => {
    const logMessage = `${timestamp} [${
      requestId || "00000000-0000-0000-0000-000000000000"
    }] ${level}: ${message}, ${JSON.stringify(metadata)}`
    if (stack) {
      return `${logMessage}\n${stack}`
    }
    return logMessage
  },
)

export const GlobalLogger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.colorize(),
    format.errors({ stack: true }),
    myFormat,
  ),
  // silent: process.env.NODE_ENV === "test",
  transports: [new winston.transports.Console()],
})

// Database error messages carry the failing SQL and its bound values.
const describeError = (error: unknown) => {
  const dbError =
    (error as { nativeError?: unknown } | null)?.nativeError ?? error
  if (dbError instanceof DatabaseError) {
    const { code, routine, table, column, constraint } = dbError
    return {
      error: `database error ${code}`,
      routine,
      table,
      column,
      constraint,
    }
  }
  return {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  }
}

const loggerMiddleware = async (
  ctx: CustomContext,
  next: () => Promise<any>,
) => {
  const start = Date.now()
  ctx.state.start = start
  const log = GlobalLogger.child({ requestId: randomUUID() })
  ctx.log = log
  log.info(`${ctx.request.method} ${ctx.path}`, {
    ip: ctx.request.ip,
    origin: ctx.request.origin,
  })
  try {
    await next()
  } catch (e) {
    const ms = Date.now() - start
    log.error(
      `Crashed ${ctx.request.method} ${ctx.path} in ${ms}ms`,
      describeError(e),
    )
    throw e
  }
  const ms = Date.now() - start
  log.info(
    `Completed ${ctx.request.method} ${ctx.path} ${ctx.response.status} in ${ms}ms`,
  )
}

export default loggerMiddleware
