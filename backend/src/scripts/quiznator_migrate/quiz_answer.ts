import { QueryFailedError } from "typeorm"
import {
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
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
  let itemsNotFound = 0
  const alreadyMigrated = 0

  await new Promise(
    async (
      resolve: (val: any) => any,
      reject: (err: Error) => any,
    ): Promise<any> => {
      try {
        const poolSize = 50000
        let pool: any = []

        for (let idx = 0; idx < answers.length; idx++) {
          const extAnswer = answers[idx]
          /*     const existingAnswer = await QuizAnswer.findOne(getUUIDByString(answer._id))
          if (existingAnswer) {
            bar.tick()
            alreadyMigrated++
            continue
          } */
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
            const newAnswers = await Promise.all(
              pool.map(
                async (quizData: any): Promise<any> => {
                  const { quiz, user, answer } = quizData

                  const quizItems = await quiz.items

                  if (quizItems.length === 0) {
                    return null
                  }

                  const quizAnswer = await QuizAnswer.create({
                    id: getUUIDByString(answer._id),
                    quiz,
                    user,
                    status: "submitted", // TODO
                    languageId: quiz.course.languages[0].id,
                  }).save()

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
                          await QuizItemAnswer.create({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: quizAnswer.id,
                            quizItemId: quizItem.id,
                            textData: answer.data,
                          }).save()
                          break

                        case "open":
                          await QuizItemAnswer.create({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: quizAnswer.id,
                            quizItemId: quizItem.id,
                            textData:
                              typeof answer.data === "string"
                                ? answer.data
                                : answer.data[quizItem.id],
                          }).save()
                          break

                        case "multiple-choice":
                          const qia = await QuizItemAnswer.create({
                            id: getUUIDByString(answer._id),
                            quizAnswerId: quizAnswer.id,
                            quizItemId: quizItem.id,
                            textData: "",
                          }).save()
                          let chosenOptions =
                            Array.isArray(answer.data) ||
                            typeof answer.data !== "object"
                              ? answer.data
                              : answer.data[quizItem.id]
                          if (!Array.isArray(chosenOptions)) {
                            chosenOptions = [chosenOptions]
                          }
                          await Promise.all(
                            chosenOptions.map((chosenOption: any) =>
                              QuizOptionAnswer.create({
                                id: getUUIDByString(answer._id + chosenOption),
                                quizItemAnswerId: qia.id,
                                quizOptionId: getUUIDByString(
                                  quiz.id + quizItem.id + chosenOption,
                                ),
                              }).save(),
                            ),
                          )
                          break
                      }
                    } catch (err) {
                      if (!(err instanceof QueryFailedError)) {
                        throw err
                      }
                    }
                  }

                  bar.tick()
                  return quizAnswer
                },
              ),
            )

            itemsNotFound += newAnswers.filter(v => !v).length

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
