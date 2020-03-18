import Router from "koa-router"
import { CustomContext, CustomState } from "../types"
import widget from "./widget"

const api = new Router<CustomState, CustomContext>({
  prefix: "/api/v2",
})

api.use(widget.routes())

export default api
