import { Config } from "knex"
import env from "./src/util/environment"

const configOptions: { [env: string]: Config } = {
  development: {
    client: "pg",
    connection: {
      host: "/var/run/postgresql",
      database: env.DB_NAME || "quizzes_dev",
    },
    migrations: {
      directory: "./database/migrations",
      extension: "ts",
    },
    seeds: { directory: "./database/seeds" },
  },

  test: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      database: "quizzes_test",
    },
    migrations: {
      directory: "./database/migrations",
      extension: "ts",
    },
    seeds: { directory: "./database/seeds" },
  },

  production: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    },
    migrations: {
      directory: "./database/migrations",
    },
  },
}

module.exports = configOptions[env.NODE_ENV || "development"]
