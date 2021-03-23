import Router from "koa-router"
import accessControl from "../../../middleware/access_control"
import { Language } from "../../../models"
import { CustomContext, CustomState } from "../../../types"

const languagesRoutes = new Router<CustomState, CustomContext>({
  prefix: "/languages",
}).get("/all", accessControl(), async ctx => {
  ctx.body = await Language.getAll()
})

export default languagesRoutes
