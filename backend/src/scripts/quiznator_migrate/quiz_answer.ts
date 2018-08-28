import { QueryFailedError } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  QuizOption,
  QuizOptionAnswer,
  User,
} from "../../models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateQuizAnswers(
  quizzes: { [quizID: string]: Quiz },
  users: { [userID: string]: User },
) {
  console.log("Querying quiz answers...")
  const answers = await QNQuizAnswer.find({})
  const bar = progressBar("Migrating quiz answers", answers.length)
  let quizNotFound = 0
  let userNotFound = 0
  const itemsNotFound = 0
  const alreadyMigrated = 0

  await new Promise(
    async (
      resolve: (val: any) => any,
      reject: (err: Error) => any,
    ): Promise<any> => {
      try {
        const poolSize = 13100
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

                  quizAnswers.push({
                    id: getUUIDByString(answer._id),
                    quizId: quiz.id,
                    userId: user.id,
                    status: "submitted", // TODO
                    languageId: quiz.course.languages[0].id,
                  })

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
                          })
                          break

                        case "multiple-choice":
                          quizItemAnswers.push({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: getUUIDByString(answer._id),
                            quizItemId: quizItem.id,
                            textData: "",
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

            await QuizAnswer.createQueryBuilder()
              .insert()
              .values(quizAnswers)
              .onConflict(`("id") DO NOTHING`)
              .execute()
            const itemAnswerChunk = 16300
            for (let i = 0; i < quizItemAnswers.length; i += itemAnswerChunk) {
              await QuizItemAnswer.createQueryBuilder()
                .insert()
                .values(quizItemAnswers.slice(i, i + itemAnswerChunk))
                .onConflict(`("id") DO NOTHING`)
                .execute()
            }
            const optionAnswerChunk = 21800
            for (
              let i = 0;
              i < quizOptionAnswers.length;
              i += optionAnswerChunk
            ) {
              await QuizOptionAnswer.createQueryBuilder()
                .insert()
                .values(quizOptionAnswers.slice(i, i + optionAnswerChunk))
                .onConflict(`("id") DO NOTHING`)
                .execute()
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

  console.log(
    `Quiz answers migrated. ${quizNotFound +
      userNotFound} answers were skipped,` +
      `${quizNotFound} did not match any quiz, ${userNotFound} did not match any` +
      `user, the quizzes of ${itemsNotFound} did not have any answers and ` +
      `${alreadyMigrated} were already migrated.`,
  )
}
