import fs from "fs"
import path from "path"

import type { Knex } from "knex"
import { types } from "pg"

import env from "./src/util/environment"

types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value))
types.setTypeParser(types.builtins.FLOAT8, (value) => parseFloat(value))
types.setTypeParser(types.builtins.INT8, (value) => parseInt(value))

const migrationsDirectory = path.join(__dirname, "database", "migrations")

// Production runs the compiled .js migrations from dist/, but knex_migrations
// rows are named after the original .ts files, so names always end in ".ts".
const migrationSource: Knex.MigrationSource<{ file: string }> = {
  async getMigrations() {
    const files = await fs.promises.readdir(migrationsDirectory)
    return files
      .filter((file) => /\.(ts|js)$/.test(file))
      .sort()
      .map((file) => ({ file }))
  },
  getMigrationName({ file }) {
    return file.replace(/\.js$/, ".ts")
  },
  getMigration({ file }) {
    return require(path.join(migrationsDirectory, file))
  },
}

const seeds = { directory: path.join(__dirname, "database", "seeds") }

const configOptions: { [env: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: env.DB_HOST || "/var/run/postgresql",
      database: env.DB_NAME || "quizzes_dev",
      user: env.DB_USER || "postgres",
      password: env.DB_PASSWORD || "",
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
    },
    migrations: { migrationSource },
    seeds,
  },

  test: {
    client: "pg",
    connection: {
      host: env.DB_HOST || "localhost",
      port: env.DB_PORT ? Number(env.DB_PORT) : 5432,
      user: env.DB_USER || "postgres",
      password: env.DB_PASSWORD || "postgres",
      database: "quizzes_test",
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
    },
    migrations: { migrationSource },
    seeds,
  },

  production: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      timezone: "UTC",
      application_name: "quizzes",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
      propagateCreateError: false,
    },
    migrations: { migrationSource },
  },
}

function setTimeZoneToUTC(
  connection: { query: (sql: string, cb: (err: Error | null) => void) => void },
  callback: (err: Error | null, connection: unknown) => void,
) {
  connection.query("SET TIMEZONE = UTC;", (err) => {
    callback(err, connection)
  })
}

export default configOptions[env.NODE_ENV || "development"]
