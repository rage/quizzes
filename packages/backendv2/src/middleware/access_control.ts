import { CustomContext } from "../types"
import { getCurrentUserDetails } from "../services/tmc"
import { UnauthorizedError } from "../util/error"

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
      return next()
    } catch (error) {
      throw new UnauthorizedError("unauthorized")
    }
  }
  return accessControl
}

export default accessControl
