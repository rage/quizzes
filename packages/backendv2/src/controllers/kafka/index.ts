import Router from "koa-router"
import accessControl from "../../middleware/access_control"
import { KafkaMessage } from "../../models"
import { CustomState, CustomContext } from "../../types"

const kafkaRoutes = new Router<CustomState, CustomContext>({
  prefix: "/kafka",
}).get("/healthz/:topic?", accessControl(), async ctx => {
  const topic = ctx.params.topic
  const kafkaMessageCount = await KafkaMessage.getCurrentCountByTopic(topic)
  if (kafkaMessageCount <= 1000) {
    ctx.status = 200
  } else {
    ctx.status = 500
  }
})

export default kafkaRoutes
