import dotenv from "dotenv"
import "reflect-metadata"
import { Container, Service } from "typedi"
import {
  Connection,
  createConnection,
  EntitySchema,
  useContainer,
} from "typeorm"
import * as Models from "../models"
import { SnakeNamingStrategy } from "./snake_naming"

@Service()
export class Database {
  private conn: Connection

  public async connect(): Promise<Connection> {
    if (this.conn) {
      await this.conn.connect()
      return this.conn
    }

    useContainer(Container)

    this.conn = await createConnection({
      database: process.env.DB_NAME || "quizzes",
      entities: Object.values(Models),
      host: process.env.DB_HOST || "/var/run/postgresql",
      logging: !!process.env.DB_LOGGING || true,
      namingStrategy: new SnakeNamingStrategy(),
      password: process.env.DB_PASSWORD || undefined,
      synchronize: true,
      type: "postgres",
      username: process.env.DB_USER || undefined,
    })

    return this.conn
  }
}

export default Database
/* interface IDB {
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

export default db */
