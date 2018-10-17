import "reflect-metadata"
import { Connection, createConnection, EntitySchema } from "typeorm"

import * as Models from "../models"
import { SnakeNamingStrategy } from "./snake_naming"

interface IDB {
  conn: Connection | undefined
  promise: Promise<Connection> | undefined
}
const db: IDB = {
  conn: undefined,
  promise: undefined,
}

db.promise = createConnection({
  type: "postgres",
  host: process.env.DB_HOST || "/var/run/postgresql",
  database: process.env.DB_NAME || "quizzes",
  username: process.env.DB_USER || undefined,
  password: process.env.DB_PASSWORD || undefined,
  entities: Object.values(Models),
  synchronize: true,
  logging: !!process.env.DB_LOGGING || true,
  namingStrategy: new SnakeNamingStrategy(),
}).then((conn: Connection) => (db.conn = conn))

export default db
