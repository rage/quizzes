import Router from "koa-router"
import { CustomContext, CustomState } from "../../types"
import answersRoutes from "./routes/answersRoutes"
import quizzesRoutes from "./routes/quizzesRoutes"
import coursesRoutes from "./routes/coursesRoutes"
import userRoutes from "./routes/usersRoutes"
import languagesRoutes from "./routes/languagesRoutes"
import kafkaRoutes from "./routes/kafkaRoutes"

const dashboard = new Router<CustomState, CustomContext>({
  prefix: "/dashboard",
})

dashboard.use(answersRoutes.routes())
dashboard.use(quizzesRoutes.routes())
dashboard.use(coursesRoutes.routes())
dashboard.use(userRoutes.routes())
dashboard.use(languagesRoutes.routes())
dashboard.use(kafkaRoutes.routes())

export default dashboard
