import { Model, snakeCaseMappers } from "objection"
import { knex as createKnex } from "knex"
import knexConfig from "../knexfile"

const knex = createKnex(knexConfig)

export const setUpDB = () => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
}

export default knex
