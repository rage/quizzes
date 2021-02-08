import { Config } from "knex"
import env from "./src/util/environment"

const configOptions: { [env: string]: Config } = {
  development: {
    client: "pg",
    connection: {
      host: env.DB_HOST || "/var/run/postgresql",
      database: env.DB_NAME || "quizzes_dev",
      password: env.DB_PASSWORD || "",
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
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
      host: env.DB_HOST || "localhost",
      port: 5432,
      user: env.DB_USER || "postgres",
      password: env.DB_PASSWORD || "postgres",
      database: "quizzes_test",
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
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
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
    },
    migrations: {
      directory: "./database/migrations",
    },
  },
}

function setTimeZoneToUTC(connection: any, callback: any) {
  connection.query("SET TIMEZONE = UTC;", function(err: any) {
    callback(err, connection)
  })
}

module.exports = configOptions[env.NODE_ENV || "development"]
