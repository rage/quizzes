import Knex from "knex"
import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `.env` })
}

const knexfile = require("../../knexfile.js")

const env = process.env.NODE_ENV || "development"
const configOptions = knexfile[env]

export default Knex(configOptions)
