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
  let alreadyMigrated = 0
  for (const answer of answers) {
    const existingAnswer = await QuizAnswer.findOne(getUUIDByString(answer._id))
    if (existingAnswer) {
      bar.tick()
      alreadyMigrated++
      continue
    }
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

    const newAnswer = await migrateQuizAnswer(quiz, user, answer)
    if (!newAnswer) {
      itemsNotFound++
      continue
    }
    bar.tick()
  }

  console.log(
    `Quiz answers migrated. ${quizNotFound +
      userNotFound} answers were skipped, ${quizNotFound} did not match any quiz, ${userNotFound} did not match any user, the quizzes of ${itemsNotFound} did not have any answers and ${alreadyMigrated} were already migrated.`,
  )
}

async function migrateQuizAnswer(
  quiz: Quiz,
  user: User,
  answer: { [key: string]: any },
): Promise<QuizAnswer> {
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
    answer.data = answer.data.map(entry => getUUIDByString(quiz.id + entry))
  } else if (typeof answer.data === "object") {
    const newData: { [key: string]: any } = {}
    for (const [itemID, answerContent] of Object.entries(answer.data)) {
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
          Array.isArray(answer.data) || typeof answer.data !== "object"
            ? answer.data
            : answer.data[quizItem.id]
        if (!Array.isArray(chosenOptions)) {
          chosenOptions = [chosenOptions]
        }
        for (const chosenOption of chosenOptions) {
          await QuizOptionAnswer.create({
            id: getUUIDByString(answer._id + chosenOption),
            quizItemAnswerId: qia.id,
            quizOptionId: getUUIDByString(quiz.id + quizItem.id + chosenOption),
          }).save()
        }
        break
    }
  }

  return quizAnswer
}
