import http from "http"
import Koa from "koa"
import { Model } from "objection"
import { knex } from "./src/config/knex"
import api from "./src/controllers/api"

Model.knex(knex)

const app = new Koa()

app.use(api.routes())

http
  .createServer(app.callback())
  .listen(3000, () => console.log("server running on port 3000"))
