import { Model, snakeCaseMappers } from "objection"
import * as pg from "pg"
import Knex from "knex"
import * as knexConfig from "../knexfile"

const knex = Knex(knexConfig)

export const setUpDB = () => {
  pg.types.setTypeParser(1700, parseFloat)

  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
}

export default knex
