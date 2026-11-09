import Koa from "koa"
import bodyParser from "koa-bodyparser"

import cors from "@koa/cors"

import { setUpDB } from "./database/knex"
import api from "./src/controllers/api"
import errorHandler from "./src/middleware/error_handler"
import logger from "./src/middleware/logger"
import { CustomContext, CustomState } from "./src/types"

setUpDB()

const app = new Koa<CustomState, CustomContext>()

app.use(cors())

app.use(async (ctx, next) => {
  ctx.set("X-Content-Type-Options", "nosniff")
  if (ctx.path.startsWith("/api/v2/dashboard/")) {
    ctx.set("Cache-Control", "no-store")
  }
  await next()
})

app.use(errorHandler)

app.use(logger)

app.use(bodyParser())

app.use(api.routes())

export type AppContext = typeof app.context

export default app
