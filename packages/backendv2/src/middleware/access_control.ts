import { CustomContext } from "../types"
import { getCurrentUserDetails } from "../services/tmc"

interface AccessControlOptions {
  administator?: boolean
  unrestricted?: boolean
}

const accessControl = (options?: AccessControlOptions) => {
  const accessControl = async (
    ctx: CustomContext,
    next: () => Promise<any>,
  ) => {
    if (options?.unrestricted) {
      return next()
    }
    try {
      const user = await getCurrentUserDetails(
        ctx.headers.authorization.toLocaleLowerCase().replace("bearer ", ""),
      )
      ctx.state.user = user
      if (options?.administator && !user.administrator) {
        throw new Error()
      }
    } catch (error) {
      error.status = 401
      error.message = "unauthorized"
      throw error
    }
    if (ctx.state.user) {
      await next()
    }
  }
  return accessControl
}

export default accessControl
