import { ParameterizedContext } from "koa"

const errorHandler = async (
  ctx: ParameterizedContext,
  next: () => Promise<any>,
) => {
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
