import { CustomContext } from "../types"

const errorHandler = async (ctx: CustomContext, next: () => Promise<any>) => {
  try {
    await next()
  } catch (error) {
    ctx.status = error.status || error.statusCode || 500
    ctx.body = {
      message: error.message,
    }
  }
}

export default errorHandler
