import "reflect-metadata"

// tslint:disable-next-line:no-var-requires
require("module-alias/register")

import { logger } from "@quizzes/common/config/winston"
import bodyParser from "body-parser"
import compression from "compression" // compresses requests
import dotenv from "dotenv"
import errorHandler from "errorhandler"
import express, {
  Application,
  ErrorRequestHandler,
  RequestHandler,
} from "express"
import expressValidator from "express-validator"
import morgan from "morgan"
import path from "path"
import { createExpressServer, useContainer } from "routing-controllers"
import { Container, Service } from "typedi"
import controllers from "./controllers"
import { AuthenticationMiddleware } from "./middleware/authentication"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" })
}

const API_PATH = process.env.API_PATH

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
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }),
    errorHandler(),
  ]

  public constructor() {
    useContainer(Container)

    this.application = createExpressServer({
      cors: true,
      routePrefix: API_PATH,
      controllers,
      middlewares: [AuthenticationMiddleware],
    })

    this.handlers.forEach(handler => this.application.use(handler))
  }

  public getApp(): Application {
    return this.application
  }
}
