import dotenv from "dotenv"
import "reflect-metadata"
import {
  Connection,
  createConnection,
  useContainer,
  EntitySchema,
} from "typeorm"
import { Container } from "typedi" // TODO: check if these are properly added
import * as Models from "../models"
import { SnakeNamingStrategy } from "./snake_naming"

useContainer(Container)

interface IDB {
  conn: Connection | undefined
  promise: Promise<Connection> | undefined
}

const db: IDB = {
  conn: undefined,
  promise: undefined,
}

db.promise = createConnection({
  database: process.env.DB_NAME || "quizzes",
  entities: Object.values(Models),
  host: process.env.DB_HOST || "/var/run/postgresql",
  logging: !!process.env.DB_LOGGING || true,
  namingStrategy: new SnakeNamingStrategy(),
  password: process.env.DB_PASSWORD || undefined,
  synchronize: true,
  type: "postgres",
  username: process.env.DB_USER || undefined,
}).then((conn: Connection) => (db.conn = conn))

export default db
