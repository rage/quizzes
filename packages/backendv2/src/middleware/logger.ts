import { CustomContext } from "../types"
import winston, { format } from "winston"
import { v4 as uuidv4 } from "uuid"

const myFormat = format.printf(
  ({ level, message, timestamp, requestId, ...metadata }) => {
    return `${timestamp} [${requestId}] ${level}: ${message}, ${JSON.stringify(
      metadata,
    )}`
  },
)

export const GlobalLogger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.colorize(),
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
    throw e
  }
  const ms = Date.now() - start
  log.info(
    `Completed ${ctx.request.method} ${ctx.req.url} ${ctx.response.status} in ${ms}ms`,
  )
}

export default loggerMiddleware
