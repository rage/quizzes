import { Database } from "./config/database"
import {
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  QuizOption,
  QuizOptionAnswer,
  User,
} from "./models"
import { Container } from "typedi"
import { QueryFailedError } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { calculateChunkSize, progressBar } from "./util"
import { getUUIDByString, insert } from "./util/"

import { logger } from "./config/winston"

export async function migrateQuizAnswers(
  quizzes: { [quizID: string]: Quiz },
  users: { [userID: string]: User },
  answers: any[],
): Promise<{ [answerID: string]: boolean }> {
  logger.info("Querying quiz answers...")

  const database = Container.get(Database)
  const conn = await database.getConnection()

  /*const answers = await QNQuizAnswer.find({
    $or: [
      { createdAt: { $gte: LAST_MIGRATION } },
      { updatedAt: { $gte: LAST_MIGRATION } },
    ],
  })*/
  const bar = progressBar("Migrating quiz answers", answers.length)
  let quizNotFound = 0
  let userNotFound = 0
  const existingAnswers: { [answerID: string]: boolean } = {}
  await new Promise(
    async (
      resolve: (val: any) => any,
      reject: (err: Error) => any,
    ): Promise<any> => {
      try {
        const QUIZ_INSERT_FIELD_COUNT = 7
        const poolSize = Math.floor(65535 / QUIZ_INSERT_FIELD_COUNT) - 1
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
                  if (answer.deprecated) {
                    status = "deprecated"
                  } else if (answer.rejected) {
                    status = "rejected"
                  } else if (answer.confirmed) {
                    status = "confirmed"
                  }

                  const answerID = getUUIDByString(answer._id)
                  quizAnswers.push({
                    id: answerID,
                    quizId: quiz.id,
                    userId: user.id,
                    status,
                    languageId: (await quiz.course).languages[0].id,
                    createdAt: answer.createdAt,
                    updatedAt: answer.updatedAt,
                  })
                  existingAnswers[answerID] = true

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
                    const itemID = getUUIDByString(answerID + quizItem.id)
                    switch (quizItem.type) {
                      case "essay":
                        quizItemAnswers.push({
                          id: itemID,
                          quizAnswerId: answerID,
                          quizItemId: quizItem.id,
                          intData: null,
                          textData: (answer.data || "").replace(/\0/g, ""),
                          createdAt: answer.createdAt,
                          updatedAt: answer.updatedAt,
                        })
                        break

                      case "open":
                        quizItemAnswers.push({
                          id: itemID,
                          quizAnswerId: answerID,
                          quizItemId: quizItem.id,
                          intData: null,
                          textData: (
                            (typeof answer.data === "string"
                              ? answer.data
                              : answer.data[quizItem.id]) || ""
                          ).replace(/\0/g, ""),
                          createdAt: answer.createdAt,
                          updatedAt: answer.updatedAt,
                        })
                        break
                      case "scale":
                        quizItemAnswers.push({
                          id: itemID,
                          quizAnswerId: answerID,
                          quizItemId: quizItem.id,
                          intData:
                            typeof answer.data === "number"
                              ? answer.data
                              : answer.data[quizItem.id],
                          textData: null,
                          createdAt: answer.createdAt,
                          updatedAt: answer.updatedAt,
                        })
                        break

                      case "multiple-choice":
                      case "research-agreement":
                      case "checkbox":
                        quizItemAnswers.push({
                          id: itemID,
                          quizAnswerId: answerID,
                          quizItemId: quizItem.id,
                          intData: null,
                          textData: null,
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
                            id: getUUIDByString(itemID + chosenOption),
                            quizItemAnswerId: itemID,
                            quizOptionId: optionID,
                            createdAt: answer.createdAt,
                            updatedAt: answer.updatedAt,
                          })
                        }
                        break
                    }
                  }
                },
              ),
            )

            await insert(QuizAnswer, quizAnswers)
            const itemAnswerChunk = calculateChunkSize(quizItemAnswers[0])
            for (let i = 0; i < quizItemAnswers.length; i += itemAnswerChunk) {
              await insert(
                QuizItemAnswer,
                quizItemAnswers.slice(i, i + itemAnswerChunk),
              )
            }
            const optionAnswerChunk = calculateChunkSize(quizOptionAnswers[0])
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

  logger.info("Deprecating duplicate answers...")
  await conn.query(`
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

  logger.info(
    `Quiz answers migrated. ${quizNotFound} did not match any quiz and ` +
      `${userNotFound} did not match any user`,
  )
  return existingAnswers
}
