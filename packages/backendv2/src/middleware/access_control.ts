import { Context } from "koa"
import { getCurrentUserDetails } from "../services/tmc"
import { userInfo } from "os"

interface AccessControlOptions {
  administator?: boolean
  unrestricted?: boolean
}

const accessControl = (options?: AccessControlOptions) => {
  const accessControl = async (ctx: Context, next: () => Promise<any>) => {
    if (options?.unrestricted) {
      await next()
    } else {
      try {
        ctx.state.user = await getCurrentUserDetails(
          ctx.headers.authorization.toLocaleLowerCase().replace("bearer ", ""),
        )
        if (options?.administator) {
          ctx.assert(ctx.state.user.administator, 401)
        }
        await next()
      } catch (error) {
        ctx.throw(401)
      }
    }
  }
  return accessControl
}

export default accessControl
