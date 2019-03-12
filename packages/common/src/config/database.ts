import dotenv from "dotenv"
import "reflect-metadata"
import { Container, Service } from "typedi"
import {
  Connection,
  createConnection,
  EntitySchema,
  getConnectionOptions,
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

    const connectionOptions = await getConnectionOptions()

    Object.assign(connectionOptions, {
      entities: Object.values(Models),
      namingStrategy: new SnakeNamingStrategy(),
    })

    this.conn = await createConnection(connectionOptions)

    return this.conn
  }

  public async getConnection(): Promise<Connection> {
    if (!this.conn) {
      await this.connect()
    }

    return this.conn
  }
}

export default Database
