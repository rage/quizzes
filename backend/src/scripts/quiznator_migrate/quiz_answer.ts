import { Quiz, QuizAnswer, User } from "../../models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateQuizAnswers(
  quizzes: { [quizID: string]: Quiz },
  users: { [userID: string]: User },
): Promise<{ [answerID: string]: QuizAnswer }> {
  console.log("Querying quiz answers...")
  const answers = await QNQuizAnswer.find({})
  const newAnswers: { [answerID: string]: QuizAnswer } = {}
  const bar = progressBar("Migrating quiz answers", answers.length)
  let quizNotFound = 0
  let userNotFound = 0
  for (const answer of answers) {
    const quiz = quizzes[getUUIDByString(answer.quizId)]
    if (!quiz) {
      quizNotFound++
      bar.tick()
      continue
    }

    const user = users[answer.answererId]
    if (!user) {
      userNotFound++
      bar.tick()
      continue
    }

    const newAnswer = await migrateQuizAnswer(quiz, user, answer)
    newAnswers[newAnswer.id] = newAnswer
    bar.tick()
  }

  console.log(`Quiz answers migrated. ${quizNotFound + userNotFound} answers
 were skipped, ${quizNotFound} did not match any quiz and ${userNotFound} did
 not match any user.`)

  return newAnswers
}

export async function migrateQuizAnswer(
  quiz: Quiz,
  user: User,
  answer: { [key: string]: any },
): Promise<QuizAnswer> {
  const newAnswer = QuizAnswer.create({
    id: getUUIDByString(answer._id),
    quiz,
    user,
    status: "draft", // TODO
    language: quiz.course.languages[0],
  })
  await newAnswer.save()
  return newAnswer
}
