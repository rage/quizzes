import Router from "koa-router"
import accessControl from "../../../middleware/access_control"
import { KafkaMessage } from "../../../models"
import { CustomState, CustomContext } from "../../../types"

const kafkaRoutes = new Router<CustomState, CustomContext>({
  prefix: "/kafka",
})
  .get("/health", accessControl(), async ctx => {
    const kafkaMessageCount = await KafkaMessage.getCurrentCountByTopic()
    if (kafkaMessageCount < 1000) {
      ctx.status = 200
    } else {
      ctx.status = 500
    }
  })
  .get("/health/:topic", accessControl(), async ctx => {
    const topic = ctx.params.topic
    const kafkaMessageCount = await KafkaMessage.getCurrentCountByTopic(topic)
    console.log(kafkaMessageCount)
    if (kafkaMessageCount <= 1000) {
      ctx.status = 200
    } else {
      ctx.status = 500
    }
  })

export default kafkaRoutes
