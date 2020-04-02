import "reflect-metadata"

// tslint:disable-next-line:no-var-requires
require("module-alias/register")

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
import { logger } from "./config/winston"
import controllers from "./controllers"

import * as typeorm from "typeorm"

import { AuthenticationMiddleware } from "./middleware/authentication"
import { SentryRequestHandlerMiddleware } from "./middleware/sentry"
import { SentryErrorHandlerMiddleware } from "./middleware/sentry"

import * as Sentry from "@sentry/node"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" })
}

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
    typeorm.useContainer(Container)

    if (process.env.SENTRY_DSN) {
      Sentry.init({ dsn: process.env.SENTRY_DSN })
    }

    this.application = createExpressServer({
      cors: true,
      // routePrefix: "/",
      controllers,
      middlewares: [
        SentryRequestHandlerMiddleware,
        AuthenticationMiddleware,
        SentryErrorHandlerMiddleware,
      ],
    })

    this.handlers.forEach(handler => this.application.use(handler))
  }

  public getApp(): Application {
    return this.application
  }
}
