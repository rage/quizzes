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

    if (!(ctx as any).headers.authorization) {
      throw new BadRequestError("No Authorization header provided.")
    }

    const token: string =
      (ctx as any).headers.authorization.replace(/bearer /i, "") || ""

    // attempt retrieval of user from cache
    let user = null
    if (redis.client) {
      try {
        const cachedUser = await redis.client.get(token)
        if (cachedUser) {
          user = JSON.parse(cachedUser)
        }
      } catch (error) {
        ctx.log.error("Redis GET operation failed", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
        // Continue without cache - will fetch from TMC server
      }
    }

    // catches null and undefined
    if (user === null) {
      try {
        // fetch user from TMC server and cache details
        user = await getCurrentUserDetails(token)
        if (redis.client) {
          try {
            await redis.client.set(token, JSON.stringify(user), "EX", 3600)
          } catch (error) {
            ctx.log.error("Redis SET operation failed", {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            })
            // Continue without caching - user is still authenticated
          }
        }
      } catch (error) {
        throw new UnauthorizedError("unauthorized")
      }
    }

    ;(ctx as any).state.user = user

    if (options?.administrator && !user.administrator) {
      throw new ForbiddenError("forbidden")
    }

    return next()
  }
  return accessControl
}

export default accessControl
