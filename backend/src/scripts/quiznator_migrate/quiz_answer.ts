import { QueryFailedError } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import db from "../../database"
import {
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  QuizOption,
  QuizOptionAnswer,
  User,
} from "../../models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { getUUIDByString, insert, progressBar } from "./util"

export async function migrateQuizAnswers(
  quizzes: { [quizID: string]: Quiz },
  users: { [userID: string]: User },
): Promise<{ [answerID: string]: boolean }> {
  console.log("Querying quiz answers...")
  const answers = await QNQuizAnswer.find({})
  const bar = progressBar("Migrating quiz answers", answers.length)
  let quizNotFound = 0
  let userNotFound = 0
  const itemsNotFound = 0
  const alreadyMigrated = 0
  const existingAnswers: { [answerID: string]: boolean } = {}
  await new Promise(
    async (
      resolve: (val: any) => any,
      reject: (err: Error) => any,
    ): Promise<any> => {
      try {
        const poolSize = 9300
        let pool: any = []

        for (let idx = 0; idx < answers.length; idx++) {
          const extAnswer = answers[idx]

          const extQuiz = quizzes[getUUIDByString(extAnswer.quizId)]
          if (!extQuiz) {
            quizNotFound++
            continue
          }

          const extUser = users[extAnswer.answererId]
          if (!extUser) {
            userNotFound++
            continue
          }
          pool.push({ quiz: extQuiz, user: extUser, answer: extAnswer })

          if (pool.length > poolSize || idx === answers.length - 1) {
            const quizAnswers: Array<QueryPartialEntity<QuizAnswer>> = []
            const quizItemAnswers: Array<
              QueryPartialEntity<QuizItemAnswer>
            > = []
            const quizOptionAnswers: Array<
              QueryPartialEntity<QuizOptionAnswer>
            > = []
            await Promise.all(
              pool.map(
                async (quizData: any): Promise<any> => {
                  const { quiz, user, answer } = quizData

                  const quizItems = await quiz.items

                  if (quizItems.length === 0) {
                    quizNotFound++
                    return
                  }

                  let status = "submitted"
                  if (answer.rejected) {
                    status = "rejected"
                  } else if (answer.confirmed) {
                    status = "confirmed"
                  }

                  const id = getUUIDByString(answer._id)
                  quizAnswers.push({
                    id,
                    quizId: quiz.id,
                    userId: user.id,
                    status,
                    languageId: quiz.course.languages[0].id,
                    createdAt: answer.createdAt,
                    updatedAt: answer.updatedAt,
                  })
                  existingAnswers[id] = true

                  QuizAnswer.create()

                  if (Array.isArray(answer.data)) {
                    answer.data = answer.data.map((entry: any) =>
                      getUUIDByString(quiz.id + entry),
                    )
                  } else if (typeof answer.data === "object") {
                    const newData: { [key: string]: any } = {}
                    for (const [itemID, answerContent] of Object.entries(
                      answer.data,
                    )) {
                      newData[getUUIDByString(quiz.id + itemID)] = answerContent
                    }
                    answer.data = newData
                  }

                  for (const quizItem of quizItems) {
                    try {
                      switch (quizItem.type) {
                        case "essay":
                          quizItemAnswers.push({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: getUUIDByString(answer._id),
                            quizItemId: quizItem.id,
                            textData: (answer.data || "").replace(/\0/g, ""),
                            createdAt: answer.createdAt,
                            updatedAt: answer.updatedAt,
                          })
                          break

                        case "open":
                          quizItemAnswers.push({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: getUUIDByString(answer._id),
                            quizItemId: quizItem.id,
                            textData: (
                              (typeof answer.data === "string"
                                ? answer.data
                                : answer.data[quizItem.id]) || ""
                            ).replace(/\0/g, ""),
                            createdAt: answer.createdAt,
                            updatedAt: answer.updatedAt,
                          })
                          break

                        case "multiple-choice":
                        case "research-agreement":
                          quizItemAnswers.push({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: getUUIDByString(answer._id),
                            quizItemId: quizItem.id,
                            textData: "",
                            createdAt: answer.createdAt,
                            updatedAt: answer.updatedAt,
                          })
                          let chosenOptions =
                            Array.isArray(answer.data) ||
                            typeof answer.data !== "object"
                              ? answer.data
                              : answer.data[quizItem.id]
                          if (!Array.isArray(chosenOptions)) {
                            chosenOptions = [chosenOptions]
                          }
                          const quizOptions: {
                            [optionID: string]: QuizOption
                          } = {}
                          for (const option of await quizItem.options) {
                            quizOptions[option.id] = option
                          }

                          for (const chosenOption of chosenOptions) {
                            const optionID = getUUIDByString(
                              quiz.id + quizItem.id + chosenOption,
                            )
                            if (!(optionID in quizOptions)) {
                              continue
                            }
                            quizOptionAnswers.push({
                              id: getUUIDByString(answer._id + chosenOption),
                              quizItemAnswerId: getUUIDByString(answer._id),
                              quizOptionId: optionID,
                              createdAt: answer.createdAt,
                              updatedAt: answer.updatedAt,
                            })
                          }
                          break
                      }
                    } catch (err) {
                      if (!(err instanceof QueryFailedError)) {
                        throw err
                      }
                    }
                  }
                },
              ),
            )

            await insert(QuizAnswer, quizAnswers)
            const itemAnswerChunk = 10900
            for (let i = 0; i < quizItemAnswers.length; i += itemAnswerChunk) {
              await insert(
                QuizItemAnswer,
                quizItemAnswers.slice(i, i + itemAnswerChunk),
              )
            }
            const optionAnswerChunk = 13100
            for (
              let i = 0;
              i < quizOptionAnswers.length;
              i += optionAnswerChunk
            ) {
              await insert(
                QuizOptionAnswer,
                quizOptionAnswers.slice(i, i + optionAnswerChunk),
              )
            }

            bar.tick(quizAnswers.length)
            pool = []
          }
        }
      } catch (e) {
        reject(e)
      }
      return resolve({})
    },
  )

  console.log("Deprecating duplicate answers...")
  await db.conn.query(`
    UPDATE quiz_answer
    SET status='deprecated'
    WHERE id IN (
      SELECT qa1.id
      FROM quiz_answer qa1
      INNER JOIN (
        SELECT quiz_id,
               user_id,
               MAX(created_at) AS last_created_at
        FROM quiz_answer
        GROUP BY quiz_id, user_id
        HAVING COUNT(*) > 1
      ) qa2 ON qa1.quiz_id = qa2.quiz_id
           AND qa1.user_id = qa2.user_id
      WHERE qa1.created_at < qa2.last_created_at
    );`)

  console.log(
    `Quiz answers migrated. ${quizNotFound +
      userNotFound} answers were skipped:` +
      `${quizNotFound} did not match any quiz, ${userNotFound} did not match any` +
      `user, the quizzes of ${itemsNotFound} did not have any answers and ` +
      `${alreadyMigrated} were already migrated.`,
  )
  return existingAnswers
}
