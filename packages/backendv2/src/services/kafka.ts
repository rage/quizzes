import Knex from "knex"
import knex from "../../database/knex"

export const setTaskToUpdateAndBroadcast = async (
  courseId: string,
  ctx: Knex.Transaction,
) => {
  await ctx("kafka_task").insert({
    course_id: courseId,
    recalculate_progress: true,
  })
}
