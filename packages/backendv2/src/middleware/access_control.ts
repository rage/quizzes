import crypto from "crypto"

import redis from "../../config/redis"
import { getCurrentUserDetails } from "../services/tmc"
import { AuthenticatedUser, CustomContext } from "../types"
import {
  ForbiddenError,
  UnauthorizedError,
  BadRequestError,
} from "../util/error"

interface AccessControlOptions {
  administrator?: boolean
  unrestricted?: boolean
}

// Hashed and prefixed so a bearer token can never address another Redis key.
const authCacheKey = (token: string) =>
  `tmc-user:${crypto.createHash("sha256").update(token).digest("hex")}`

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

    const cacheKey = authCacheKey(token)
    let user: AuthenticatedUser | null = null
    if (redis.client) {
      try {
        const cachedUser = await redis.client.get(cacheKey)
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
        const { id, administrator } = await getCurrentUserDetails(token)
        user = { id, administrator }
        if (redis.client) {
          try {
            await redis.client.set(cacheKey, JSON.stringify(user), "EX", 3600)
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
