import http from "http"
import Koa from "koa"
import { Model, snakeCaseMappers } from "objection"
import bodyParser from "koa-bodyparser"
import { knex } from "./src/config/knex"
import api from "./src/controllers/api"
import logger from "./src/middleware/logger"
import errorHandler from "./src/middleware/error_handler"
import { CustomContext, CustomState } from "./src/types"
Model.knex(knex)
Model.columnNameMappers = snakeCaseMappers()

const app = new Koa<CustomState, CustomContext>()

app.use(errorHandler)

app.use(logger)

app.use(bodyParser())

app.use(api.routes())

http
  .createServer(app.callback())
  .listen(3000, () => console.log("server running on port 3000"))

export type AppContext = typeof app.context
