import http from "http"

import app from "./app"
import { GlobalLogger } from "./src/middleware/logger"

http
  .createServer(app.callback())
  .listen(3003, () => GlobalLogger.info("server running on port 3003"))
