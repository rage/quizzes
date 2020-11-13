import { CustomContext } from "../types"
import winston, { format } from "winston"
import { v4 as uuidv4 } from "uuid"

const myFormat = format.printf(
  ({ level, message, timestamp, requestId, stack, ...metadata }) => {
    const logMessage = `${timestamp} [${requestId ||
      "00000000-0000-0000-0000-000000000000"}] ${level}: ${message}, ${JSON.stringify(
      metadata,
    )}`
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
  transports: [new winston.transports.Console()],
})

const loggerMiddleware = async (
  ctx: CustomContext,
  next: () => Promise<any>,
) => {
  const start = Date.now()
  ctx.state.start = start
  const log = GlobalLogger.child({ requestId: uuidv4() })
  // @ts-ignore
  ctx.log = log
  log.info(`${ctx.request.method} ${ctx.req.url}`, {
    ip: ctx.request.ip,
    origin: ctx.request.origin,
  })
  try {
    await next()
  } catch (e) {
    const ms = Date.now() - start
    log.error(`Crashed ${ctx.request.method} ${ctx.req.url} in ${ms}ms`, {
      error: e.message,
    })
    log.error(e)
    throw e
  }
  const ms = Date.now() - start
  log.info(
    `Completed ${ctx.request.method} ${ctx.req.url} ${ctx.response.status} in ${ms}ms`,
  )
}

export default loggerMiddleware
