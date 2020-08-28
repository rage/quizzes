import Koa from "koa"
import { Model, snakeCaseMappers } from "objection"
import bodyParser from "koa-bodyparser"
import knex from "./database/knex"
import api from "./src/controllers/api"
import logger from "./src/middleware/logger"
import errorHandler from "./src/middleware/error_handler"
import { CustomContext, CustomState } from "./src/types"
import cors from "koa-cors"

import * as pg from "pg"

pg.types.setTypeParser(1700, function(val: any) {
    return parseFloat(val);
})

Model.knex(knex)
Model.columnNameMappers = snakeCaseMappers()

const app = new Koa<CustomState, CustomContext>()

app.use(cors())

app.use(errorHandler)

app.use(logger)

app.use(bodyParser())

app.use(api.routes())

export type AppContext = typeof app.context

export default app
