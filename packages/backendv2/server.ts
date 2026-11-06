import http from "http"
import { GlobalLogger } from "./src/middleware/logger"
import app from "./app"

http
  .createServer(app.callback())
  .listen(3003, () => GlobalLogger.info("server running on port 3003"))
