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
    async (resolve: any): Promise<any> => {
      const poolSize = 50000
      let pool: any = []

      for (let idx = 0; idx < answers.length; idx++) {
        const answer = answers[idx]
        /*     const existingAnswer = await QuizAnswer.findOne(getUUIDByString(answer._id))
      if (existingAnswer) {
        bar.tick()
        alreadyMigrated++
        continue
      } */
        const quiz = quizzes[getUUIDByString(answer.quizId)]
        if (!quiz) {
          quizNotFound++
          continue
        }

        const user = users[answer.answererId]
        if (!user) {
          userNotFound++
          continue
        }

        pool.push({ quiz, user, answer })

        if (pool.length >= poolSize || idx === answers.length - 1) {
          let innerIdx = 0

          const newAnswers = await Promise.all(
            pool.map(
              async (quizData: any): Promise<any> => {
                const { quiz, user, answer } = quizData

                const quizItems = await quiz.items

                if (quizItems.length === 0) {
                  return null
                }

                const quizAnswer = QuizAnswer.create({
                  id: getUUIDByString(answer._id),
                  quiz,
                  user,
                  status: "submitted", // TODO
                  languageId: quiz.course.languages[0].id,
                })
                await quizAnswer.save()

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
                      for (const chosenOption of chosenOptions) {
                        await QuizOptionAnswer.create({
                          id: getUUIDByString(answer._id + chosenOption),
                          quizItemAnswerId: qia.id,
                          quizOptionId: getUUIDByString(
                            quiz.id + quizItem.id + chosenOption,
                          ),
                        }).save()
                      }
                      break
                  }
                }

                innerIdx++

                if (innerIdx === 1000) {
                  bar.tick(innerIdx)
                  innerIdx = 0
                }
                return quizAnswer
              },
            ),
          )

          bar.tick(innerIdx)
          itemsNotFound += newAnswers.filter(v => !v).length

          pool = []
        }
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
