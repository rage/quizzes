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
export default db

db.promise = createConnection({
  type: "postgres",
  host: "/var/run/postgresql",
  database: "tulir",
  entities: Object.values(Models),
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
}).then(conn => (db.conn = conn))
