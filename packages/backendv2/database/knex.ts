import Knex from "knex"
import * as KnexDbManager from "knex-db-manager"
import * as knexConfig from "../knexfile"

export const dbManager = KnexDbManager.databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    superUser: "postgres",
    superPassword: "postgres",
  },
})

export default Knex(knexConfig)
