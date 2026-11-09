import Router from "@koa/router"

import { CustomContext, CustomState } from "../../types"
import answersRoutes from "./routes/answersRoutes"
import coursesRoutes from "./routes/coursesRoutes"
import languagesRoutes from "./routes/languagesRoutes"
import quizzesRoutes from "./routes/quizzesRoutes"
import userRoutes from "./routes/usersRoutes"

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})

dashboard.use(async (ctx, next) => {
  ctx.set("Cache-Control", "no-store")
  await next()
})
dashboard.use(answersRoutes.routes())
dashboard.use(quizzesRoutes.routes())
dashboard.use(coursesRoutes.routes())
dashboard.use(userRoutes.routes())
dashboard.use(languagesRoutes.routes())

export default dashboard
