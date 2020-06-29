import { CustomContext } from "../types"
import { getCurrentUserDetails } from "../services/tmc"
import { ForbiddenError, UnauthorizedError } from "../util/error"

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
    let user
    try {
      user = await getCurrentUserDetails(
        ctx.headers.authorization.toLocaleLowerCase().replace("bearer ", ""),
      )
    } catch (error) {
      throw new UnauthorizedError("unauthorized")
    }
    ctx.state.user = user
    if (options?.administator && !user.administrator) {
      throw new ForbiddenError("forbidden")
    }
    return next()
  }
  return accessControl
}

export default accessControl
