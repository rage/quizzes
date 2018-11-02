import "reflect-metadata"

// tslint:disable-next-line:no-var-requires
require("module-alias/register")

import { passport } from "@quizzes/common/config/passport-tmc"
import { logger } from "@quizzes/common/config/winston"
import bodyParser from "body-parser"
import compression from "compression" // compresses requests
import dotenv from "dotenv"
import errorHandler from "errorhandler"
import express, {
  Application,
  RequestHandler,
  ErrorRequestHandler,
} from "express"
import graphqlHTTP from "express-graphql"
import expressValidator from "express-validator"
import * as fs from "fs"
import * as lusca from "lusca"
import morgan from "morgan"
import path from "path"
import { createExpressServer, useContainer } from "routing-controllers"
import stream from "stream"
import { Container, Service } from "typedi"
import controllers from "./controllers"
import { schema } from "./graphql/schema"

const API_PATH = process.env.API_PATH || "/api/v1"
const graphqlEntry = "/graphql"

dotenv.config({ path: ".env" })

@Service()
export class App {
  private application: Application

  private handlers: Array<RequestHandler | ErrorRequestHandler> = [
    compression(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    expressValidator(),
    morgan("combined", {
      stream: {
        write: (meta: any) => logger.info(meta),
      },
    }),
    // lusca.xframe("SAMEORIGIN"),
    // lusca.xssProtection(true),
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }),
    errorHandler(),
  ]

  public constructor() {
    useContainer(Container)

    this.application = createExpressServer({
      routePrefix: API_PATH,
      controllers,
    })

    this.handlers.forEach(handler => this.application.use(handler))

    /*     this.application.use(
      graphqlEntry,
      bodyParser.json(),
      graphqlHTTP({ schema, graphiql: true }),
    ) */
  }

  public getApp(): Application {
    return this.application
  }
}
