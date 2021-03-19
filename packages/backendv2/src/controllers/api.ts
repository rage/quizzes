import Router from "koa-router"
import { CustomContext, CustomState } from "../types"
import widget from "./widget"
import dashboard from "./dashboard"
import general from "./general"

const api = new Router<CustomState, CustomContext>({
  prefix: "/api/v2",
})

api.use(widget.routes())
api.use(dashboard.routes())
api.use(general.routes())

export default api
