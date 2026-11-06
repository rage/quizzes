import { knex as createKnex } from "knex"
import knex from "../database/knex"
import env from "../src/util/environment"
import { GlobalLogger } from "../src/middleware/logger"

const quizzesViews = [
  "course",
  "course_translation",
  "peer_review",
  "peer_review_collection",
  "peer_review_collection_translation",
  "peer_review_question",
  "peer_review_question_translation",
  "quiz",
  "quiz_answer",
  "quiz_item",
  "quiz_item_answer",
  "quiz_item_translation",
  "quiz_option",
  "quiz_option_answer",
  "quiz_option_translation",
  "quiz_translation",
  "spam_flag",
  "user_quiz_state",
]

const moocfiViews = ["user_course_settings", `"user"`, "completion"]

// The moocfi views live in another database on the same server, reached with
// the quizzes credentials.
const moocfi = createKnex({
  client: "pg",
  connection: {
    host: env.DB_HOST || "/var/run/postgresql",
    database: "moocfi",
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    application_name: "quizzes",
  },
})

const refresh = async () => {
  try {
    for (const view of quizzesViews) {
      GlobalLogger.info(`Refreshing reaktor.${view} in quizzes`)
      await knex.raw(`refresh materialized view reaktor.${view}`)
    }
    for (const view of moocfiViews) {
      GlobalLogger.info(`Refreshing reaktor.${view} in moocfi`)
      await moocfi.raw(`refresh materialized view reaktor.${view}`)
    }
    GlobalLogger.info("Done")
  } catch (error) {
    GlobalLogger.error(error)
  }
  process.exit()
}

refresh()
