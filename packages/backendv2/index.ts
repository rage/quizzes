import http from "http"
import Koa from "koa"
import { Model } from "objection"
import bodyParser from "koa-bodyparser"
import { knex } from "./src/config/knex"
import api from "./src/controllers/api"
import logger from "./src/middleware/logger"
import winston from "winston"
Model.knex(knex)

interface CustomContext {
  log: winston.Logger
}

interface CustomState {
  user: any
}

const app = new Koa<CustomState, CustomContext>()
app.use(logger)

app.use(bodyParser())

app.use(api.routes())

http
  .createServer(app.callback())
  .listen(3000, () => console.log("server running on port 3000"))

export type AppContext = typeof app.context
