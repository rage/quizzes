// tslint:disable-next-line:no-var-requires
require("module-alias/register")
import errorHandler from "errorhandler"

import "@quizzes/common/config/database"
import path from "path"
import {
  useContainer as routingUseContainer,
  useExpressServer,
} from "routing-controllers"
import { Container } from "typedi"
import { useContainer as typeormUseContainer } from "typeorm"
import app from "./app"
import controllers from "./controllers"

routingUseContainer(Container)

const API_PATH = process.env.API_PATH || "/api/v1"

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

/**
 * Start Express server.
 */

const expressApp = useExpressServer(app, {
  routePrefix: API_PATH,
  controllers,
})

expressApp.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
  )
  console.log("  Press CTRL-C to stop\n")
})

export default expressApp
