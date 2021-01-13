import { CustomContext } from "../types"
import { getCurrentUserDetails } from "../services/tmc"
import {
  ForbiddenError,
  UnauthorizedError,
  BadRequestError,
} from "../util/error"

import redis from "../../config/redis"

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

    if (!ctx.headers.authorization) {
      throw new BadRequestError("No Authorization header provided.")
    }

    const token: string =
      ctx.headers.authorization.toLocaleLowerCase().replace("bearer ", "") || ""

    // attempt retrieval of user from cache
    let user = null
    if (redis && redis.get) {
      user = JSON.parse((await redis.get(token)) as string)
    }

    // catches null and undefined
    if (user === null) {
      try {
        // fetch user from TMC server and cache details
        user = await getCurrentUserDetails(token)
        if (redis && redis.setex) {
          await redis.setex(token, 3600, JSON.stringify(user))
        }
      } catch (error) {
        throw new UnauthorizedError("unauthorized")
      }
    }

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
    if (user && user.administrator) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

export default accessControl
