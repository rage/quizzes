import { CustomContext } from "../types"
import { getCurrentUserDetails } from "../services/tmc"
import {
  ForbiddenError,
  UnauthorizedError,
  BadRequestError,
} from "../util/error"

import redis from "../../config/redis"

interface AccessControlOptions {
  administrator?: boolean
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
      ctx.headers.authorization.replace(/bearer /i, "") || ""

    // attempt retrieval of user from cache
    let user = null
    if (redis.client) {
      user = JSON.parse((await redis.client.get(token)) as string)
    }

    // catches null and undefined
    if (user === null) {
      try {
        // fetch user from TMC server and cache details
        user = await getCurrentUserDetails(token)
        if (redis.client) {
          await redis.client.set(token, JSON.stringify(user), "EX", 604800)
        }
      } catch (error) {
        throw new UnauthorizedError("unauthorized")
      }
    }

    ctx.state.user = user

    if (options?.administrator && !user.administrator) {
      throw new ForbiddenError("forbidden")
    }

    return next()
  }
  return accessControl
}

export default accessControl
