import dotenv from "dotenv"
import Knex from "knex"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `.env` })
}

export const quizzes = Knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "/var/run/postgresql",
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || undefined,
    application_name: "quizzes",
  },
})

export const moocfi = Knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "/var/run/postgresql",
    database: "moocfi",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || undefined,
    application_name: "quizzes",
  },
})
