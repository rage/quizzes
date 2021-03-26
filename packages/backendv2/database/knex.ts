import { Model, snakeCaseMappers } from "objection"
import Knex from "knex"
import * as knexConfig from "../knexfile"

const knex = Knex(knexConfig)

export const setUpDB = () => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
}

export default knex
