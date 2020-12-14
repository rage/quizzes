import Knex from "knex"
import * as knexConfig from "../knexfile"

import { Pool } from "pg"

export const pool = new Pool(knexConfig.connection)

export default Knex(knexConfig)
