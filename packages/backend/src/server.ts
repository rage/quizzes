require("module-alias/register") // tslint-disable-line no-var-requires
import errorHandler from "errorhandler"

import "@quizzes/common/config/database"
import app from "./app"

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
  )
  console.log("  Press CTRL-C to stop\n")
})

export default server
