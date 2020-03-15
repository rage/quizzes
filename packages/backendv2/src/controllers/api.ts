import Router from "koa-router"
import quizzes from "./quizzes"

const api = new Router({
  prefix: "/api/v2",
})

api.use(quizzes.routes())

export default api
