import Router from "@koa/router"

import { CustomContext, CustomState } from "../types"
import dashboard from "./dashboard"
import general from "./general"
import kafka from "./kafka"
import widget from "./widget"

const api = new Router<CustomState, CustomContext>({
  prefix: "/api/v2",
})

api.use(widget.routes())
api.use(dashboard.routes())
api.use(general.routes())
api.use(kafka.routes())

export default api
