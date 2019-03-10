import TMCApi from "@quizzes/common/services/TMCApi"
import { ITMCProfileDetails } from "@quizzes/common/types"
import { NextFunction, Request, Response } from "express"
import redis from "redis"
import {
  ExpressMiddlewareInterface,
  Middleware,
  Redirect,
  UnauthorizedError,
} from "routing-controllers"
import { promisify } from "util"

@Middleware({ type: "before" })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  private client = redis.createClient(process.env.REDIS_PORT)
  private get = promisify(this.client.get).bind(this.client)

  public async use(req: any, res: any, next: any) {
    if (req.url === "/") {
      return next()
    }
    const authorization: string = req.headers.authorization || ""
    const token: string =
      authorization.toLocaleLowerCase().replace("bearer ", "") || ""
    let user: ITMCProfileDetails = JSON.parse(await this.get(token))
    if (!user) {
      try {
        user = await TMCApi.getProfile(token)
        this.client.set(token, JSON.stringify(user), "EX", 3600)
      } catch (error) {
        throw new UnauthorizedError()
      }
    }
    req.headers.authorization = user
    next()
  }
}
