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
    switch (error.constructor) {
      case BadRequestError:
        ctx.status = 400
        break
      case UnauthorizedError:
        ctx.status = 401
        break
      case ForbiddenError:
        ctx.status = 403
        break
      case NotFoundError:
        ctx.status = 404
        break
      default:
        ctx.status = 500
    }

    Sentry.withScope(function(scope) {
      scope.addEventProcessor(function(event) {
        return Sentry.Handlers.parseRequest(event, ctx.request)
      })
      Sentry.captureException(error)
    })
  }
}

export default errorHandler
