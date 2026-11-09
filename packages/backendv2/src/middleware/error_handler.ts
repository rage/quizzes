import * as Sentry from "@sentry/node"

import { CustomContext } from "../types"
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../util/error"

const errorHandler = async (ctx: CustomContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    ctx.body = {
      message: error instanceof Error ? error.message : String(error),
    }
    let reportError = true
    switch (error instanceof Error ? error.constructor : undefined) {
      case BadRequestError:
        ctx.status = 400
        break
      case UnauthorizedError:
        ctx.status = 401
        reportError = false
        break
      case ForbiddenError:
        ctx.status = 403
        reportError = false
        break
      case NotFoundError:
        ctx.status = 404
        reportError = false
        break
      default:
        ctx.status = 500
    }

    if (reportError) {
      Sentry.captureException(error)
    }
  }
}

export default errorHandler
