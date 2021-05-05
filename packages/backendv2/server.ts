import http from "http"
import { GlobalLogger } from "./src/middleware/logger"
import app from "./app"

if (process.env.NODE_ENV === "production") {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    // tslint:disable-next-line: no-var-requires
    require("newrelic")
  } else {
    console.log("New Relic not loaded because license key is missing.")
  }
}

http
  .createServer(app.callback())
  .listen(3003, () => GlobalLogger.info("server running on port 3003"))
