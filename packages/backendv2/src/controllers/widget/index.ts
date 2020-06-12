import Router from "koa-router"
import { knex } from "../../config/knex"
import { CustomContext, CustomState } from "../../types"
import { Quiz, QuizAnswer, User } from "../../models/"
import accessControl from "../../middleware/access_control"

const widget = new Router<CustomState, CustomContext>({
  prefix: "/widget",
})

  .get("/quizzes/:quizId", accessControl(), async (ctx) => {
    const quizId = ctx.params.quizId
    ctx.body = await Quiz.getQuizById(quizId)
  })

  .get(
    "/quizzes/:quizId/preview",
    accessControl({ unrestricted: true }),
    async (ctx) => {
      const quizId = ctx.params.quizId
      ctx.body = await Quiz.getQuizPreviewById(quizId)
    },
  )

  .post("/answer", accessControl(), async (ctx) => {
    const user = ctx.state.user
    const answer = ctx.request.body
    try {
      const userInDb = await User.query().findById(user.id)
      answer.user_id = user.id
      answer.status = "submitted"
      if (!userInDb) {
        answer.user = { id: user.id }
      }
      const savedAnswer = await QuizAnswer.query().insertGraph(answer)
      const validatedAnswer = await validateQuizAnswer(savedAnswer)
      ctx.body = validatedAnswer
    } catch (error) {
      error.status = 500
      throw error
    }
  })

const validateQuizAnswer = async (quizAnswer: QuizAnswer) => {
  await Promise.all([
    await knex.raw(
      `
    UPDATE
      quiz_item_answer
    SET
      correct = v.correct
    FROM
      (
          SELECT
              qia.id,
              qo.correct
          FROM
              quiz_item_answer qia
              JOIN quiz_option_answer qoa ON qia.id = qoa.quiz_item_answer_id
              JOIN quiz_option qo ON qoa.quiz_option_id = qo.id
              JOIN quiz_item qi ON qia.quiz_item_id = qi.id
          WHERE
              qi.type = 'multiple-choice'
              AND multi = false
              AND qia.correct is null
              AND qia.quiz_answer_id = :quizAnswerId
      ) AS v
    WHERE
      quiz_item_answer.id = v.id
    `,
      { quizAnswerId: quizAnswer.id },
    ),
    await knex.raw(
      `
    UPDATE
        quiz_item_answer
    SET
        correct = CASE
            WHEN v.correct = v.total_correct
            AND v.false = 0 THEN TRUE
            ELSE false
        END
    FROM
        (
            SELECT
                qi.id,
                count(
                    CASE
                        WHEN qo.correct = TRUE
                        AND qoa.id IS NOT NULL THEN 1
                    END
                ) correct,
                count(
                    CASE
                        WHEN qo.correct = FALSE
                        AND qoa.id IS NOT NULL THEN 1
                    END
                ) AS false,
                count(
                    CASE
                        WHEN qo.correct = TRUE THEN 1
                    END
                ) total_correct
            FROM
                quiz_item qi
                JOIN quiz_option qo ON qi.id = qo.quiz_item_id
                LEFT JOIN quiz_option_answer qoa ON qo.id = qoa.quiz_option_id
                AND qoa.quiz_item_answer_id IN (
                    SELECT
                        id
                    FROM
                        quiz_item_answer
                    WHERE
                        quiz_answer_id = :quizAnswerId
                )
                LEFT JOIN quiz_item_answer qia ON qoa.quiz_item_answer_id = qia.id
                AND qia.quiz_answer_id = :quizAnswerId
            WHERE
                qi.quiz_id = :quizId
                AND qi.type = 'multiple-choice'
                AND qi.multi = TRUE
                AND qia.correct is null
            GROUP BY
                qi.id
        ) v
    WHERE
        quiz_item_answer.quiz_item_id = v.id
        AND quiz_item_answer.quiz_answer_id = :quizAnswerId
    `,
      {
        quizAnswerId: quizAnswer.id,
        quizId: quizAnswer.quizId,
      },
    ),
    await knex.raw(
      `
    UPDATE
        quiz_item_answer
    SET
        correct = v.is_correct
    FROM
        (
            SELECT
                qia.id,
                qia.text_data ~ qi.validity_regex AS is_correct
            FROM
                quiz_item_answer qia
                JOIN quiz_item qi ON qia.quiz_item_id = qi.id
            WHERE
                qi.type = 'open'
                AND qia.correct IS NULL
                AND qia.quiz_answer_id = :quizAnswerId
        ) AS v
    WHERE
        quiz_item_answer.id = v.id
    `,
      { quizAnswerId: quizAnswer.id },
    ),
  ])
  const answer = await QuizAnswer.query()
    .withGraphJoined("itemAnswers.[optionAnswers]")
    .where("quiz_answer.id", quizAnswer.id)
  return answer
}

export default widget
