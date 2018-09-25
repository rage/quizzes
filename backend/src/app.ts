import bodyParser from "body-parser"
import compression from "compression" // compresses requests
import dotenv from "dotenv"
import express from "express"
import graphqlHTTP from "express-graphql"
import expressValidator from "express-validator"
import * as lusca from "lusca"
import path from "path"
import { schema } from "./graphql/schema"

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" })

// Controllers (route handlers)
import * as homeController from "./controllers/home"

// Create Express server
const app = express()

// Express configuration
app.set("port", process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())

app.use(lusca.xframe("SAMEORIGIN"))
app.use(lusca.xssProtection(true))

app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }))

/**
 * Primary app routes.
 */
app.get("/", homeController.index)

const apiEntryPoint = "/graphql"

app.use(
  apiEntryPoint,
  bodyParser.json(),
  graphqlHTTP({ schema, graphiql: true }),
)

export default app
