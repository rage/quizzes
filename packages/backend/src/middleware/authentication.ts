import { NextFunction, Request, Response } from "express"
// import redis from "redis"
import {
  ExpressMiddlewareInterface,
  Middleware,
  Redirect,
  UnauthorizedError,
} from "routing-controllers"
import { promisify } from "util"
import TMCApi from "../services/TMCApi"
import { ITMCProfileDetails } from "../types"

import redis from "../config/redis"

const whitelist = [
  /\/$/,
  /\/api\/healthz$/,
  /\/api\/v1\/quizzes\/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}\/titles\/[a-z]{2}_[A-Z]{2}$/,
  /\/api\/v1\/quizzes\/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/,
  /\/api\/v1\/quizzes\/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}\?fullInfo\=(true|false)$/,
]

@Middleware({ type: "before" })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  public async use(req: any, res: any, next: any) {
    console.log(req.url)
    let onWhiteList = false

    whitelist.forEach(regex => {
      if (req.url.match(regex)) {
        onWhiteList = true
      }
    })

    const authorization: string = req.headers.authorization || ""
    const token: string =
      authorization.toLocaleLowerCase().replace("bearer ", "") || ""

    if (onWhiteList && !token) {
      return next()
    }

    let user: ITMCProfileDetails = JSON.parse(await redis.get(token))
    if (!user) {
      try {
        user = await TMCApi.getProfile(token)
        redis.set(token, JSON.stringify(user), "EX", 3600)
      } catch (error) {
        console.log(error)
        if (onWhiteList) {
          req.headers.authorization = ""
          return next()
        }
        throw new UnauthorizedError()
      }
    }
    req.headers.authorization = user
    next()
  }
}
