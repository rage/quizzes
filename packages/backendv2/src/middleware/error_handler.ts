import { CustomContext } from "../types"
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../util/error"
import * as Sentry from "@sentry/node"

const errorHandler = async (ctx: CustomContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    ctx.body = {
      message: error.message,
    }
    let reportError = true
    switch (error.constructor) {
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
      Sentry.withScope(function(scope) {
        scope.addEventProcessor(function(event) {
          return Sentry.Handlers.parseRequest(event, ctx.request as any)
        })
        Sentry.captureException(error)
      })
    }
  }
}

export default errorHandler
