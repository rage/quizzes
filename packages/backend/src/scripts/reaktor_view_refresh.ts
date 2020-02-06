import * as knex from "../config/knex"

const quizzesViews = [
  "course",
  "course_translation",
  "peer_review",
  "peer_review_collection",
  "peer_review_collection_translation",
  "peer_review_question",
  "peer_review_question_answer",
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

const refresh = async () => {
  try {
    console.time("done in")
    console.log(new Date())
    console.log("refreshing views")
    for (const view of quizzesViews) {
      console.log(`refreshing reaktor.${view} in quizzes`)
      await knex.quizzes.raw(`refresh materialized view reaktor.${view}`)
    }
    for (const view of moocfiViews) {
      console.log(`refreshing reaktor.${view} in moocfi`)
      await knex.moocfi.raw(`refresh materialized view reaktor.${view}`)
    }
    console.timeEnd("done in")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

refresh()
