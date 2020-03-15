import Knex from "knex"
import env from "../util/environment"

export const knex = Knex({
  client: "pg",
  connection: {
    host: env.DB_HOST || "/var/run/postgresql",
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD || undefined,
  },
  searchPath: ["public"],
})
