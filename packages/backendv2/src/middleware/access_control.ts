import { CustomContext } from "../types"
import { getCurrentUserDetails } from "../services/tmc"
import { ForbiddenError, UnauthorizedError } from "../util/error"

interface AccessControlOptions {
  administator?: boolean
  unrestricted?: boolean
}

export const accessControl = (options?: AccessControlOptions) => {
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
    console.log(user)
    ctx.state.user = user
    if (options?.administator && !user.administrator) {
      throw new ForbiddenError("forbidden")
    }
    return next()
  }
  return accessControl
}

export const validToken = async (token: string): Promise<boolean> => {
  try {
    const user = await getCurrentUserDetails(token)
    if (user) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

export default accessControl
