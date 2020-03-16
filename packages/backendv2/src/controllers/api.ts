import Router from "koa-router"
import widget from "./widget"

const api = new Router({
  prefix: "/api/v2",
})

api.use(widget.routes())

export default api
