import * as Sentry from "@sentry/node"
import {
  ExpressErrorMiddlewareInterface,
  ExpressMiddlewareInterface,
  Middleware,
  UseBefore,
} from "routing-controllers"
import { AuthenticationMiddleware } from "./authentication"

@Middleware({ type: "before" })
@UseBefore(AuthenticationMiddleware)
export class SentryRequestHandlerMiddleware
  implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next: (err?: any) => any) {
    if (!process.env.SENTRY_DSN) {
      return next()
    }
    return Sentry.Handlers.requestHandler()(request, response, next)
  }
}

@Middleware({ type: "after" })
export class SentryErrorHandlerMiddleware
  implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    request: any,
    response: any,
    next: (err?: any) => any,
  ): void {
    if (!process.env.SENTRY_DSN) {
      return next()
    }
    return Sentry.Handlers.errorHandler({
      shouldHandleError(handledError: any) {
        // Discard all not founds and unauthorizeds
        if (handledError.status === 404 || handledError.status === 401) {
          return false
        }
        return true
      },
    })(error, request, response, next)
  }
}
