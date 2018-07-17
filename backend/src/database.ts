import "reflect-metadata"
import { Connection, createConnection } from "typeorm"

import * as Models from "./models"
import { SnakeNamingStrategy } from "./snake_naming"

interface IDB {
  conn: Connection
  promise: Promise<Connection>
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
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
}).then(conn => (db.conn = conn))

export default db
