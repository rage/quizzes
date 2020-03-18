// tslint:disable-next-line:no-var-requires
require("module-alias/register")

if (process.env.NODE_ENV === "production") {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic not loaded because license key is missing.")
  }
}

import dotenv from "dotenv"
import { Container } from "typedi"
import { App } from "./app"
import { Database } from "./config/database"

import { wsListen } from "./wsServer"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" })
}

const app = Container.get(App).getApp()
const database = Container.get(Database)
const port = process.env.PORT || 3000

database.connect() // hmm, this is async btw

wsListen()

/**
 * Start Express server.
 */

app.listen(port, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    port,
    app.get("env"),
  )
  console.log("  Press CTRL-C to stop\n")
})
