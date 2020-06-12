import { CustomContext } from "../types"
import { NotFoundError, UnauthorizedError } from "../util/error"

const errorHandler = async (ctx: CustomContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    ctx.body = {
      message: error.message,
    }
    switch (error.constructor) {
      case UnauthorizedError:
        ctx.status = 401
        break
      case NotFoundError:
        ctx.status = 404
        break
      default:
        ctx.status = 500
    }
  }
}

export default errorHandler
