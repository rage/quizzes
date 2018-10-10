import bodyParser from "body-parser"
import compression from "compression" // compresses requests
import dotenv from "dotenv"
import express from "express"
import graphqlHTTP from "express-graphql"
import expressValidator from "express-validator"
import * as lusca from "lusca"
import morgan from "morgan"
import path from "path"
import stream from "stream"
import { passport } from "../../common/config/passport-tmc"
import { logger } from "../../common/config/winston"
import { schema } from "./graphql/schema"

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" })

// Controllers (route handlers)
import * as homeController from "./controllers/home"

// Create Express server
const app = express()
const API_PATH = process.env.API_PATH || "/api/v1"

// Express configuration
app.set("port", process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(
  morgan("combined", {
    stream: {
      write: (meta: any) => logger.info(meta),
    },
  }),
)
app.use(lusca.xframe("SAMEORIGIN"))
app.use(lusca.xssProtection(true))

app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }))
/**
 * Primary app routes.
 */
app.get(
  API_PATH,
  passport.authenticate("bearer", { session: false }),
  homeController.index,
)
app.get(`${API_PATH}/quizzes/:language`, homeController.getQuizzes)
app.get("/user/:userId", homeController.userTest)

const apiEntryPoint = "/graphql"

app.use(
  apiEntryPoint,
  bodyParser.json(),
  graphqlHTTP({ schema, graphiql: true }),
)

export default app
