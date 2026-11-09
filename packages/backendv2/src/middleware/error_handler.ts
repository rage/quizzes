import * as Sentry from "@sentry/node"

import { CustomContext } from "../types"
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../util/error"

const statusByErrorType = new Map<unknown, number>([
  [BadRequestError, 400],
  [UnauthorizedError, 401],
  [ForbiddenError, 403],
  [NotFoundError, 404],
])

const statusOf = (error: unknown): number => {
  if (!(error instanceof Error)) {
    return 500
  }
  const status = statusByErrorType.get(error.constructor)
  if (status !== undefined) {
    return status
  }
  // http-errors thrown by koa middleware, e.g. bodyparser's 400 and 413
  const httpStatus = (error as { status?: unknown }).status
  if (typeof httpStatus === "number" && httpStatus >= 400 && httpStatus < 600) {
    return httpStatus
  }
  return 500
}

const errorHandler = async (ctx: CustomContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    const status = statusOf(error)
    ctx.status = status
    if (status < 500 && error instanceof Error) {
      ctx.body = { message: error.message }
    } else {
      // Server error messages can carry SQL with bound values.
      ctx.body = { message: "Internal Server Error" }
      Sentry.captureException(error)
    }
  }
}

export default errorHandler
