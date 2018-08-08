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
  for (const answer of answers) {
    const quiz = quizzes[answer.quizId]
    if (!quiz) {
      console.warn("Quiz not found for answer", answer)
      bar.tick()
      continue
    }

    const user = users[answer.answererId]
    if (!user) {
      console.warn("User not found for answer", answer)
      bar.tick()
      continue
    }

    const newAnswer = await migrateQuizAnswer(quiz, user, answer)
    newAnswers[newAnswer.id] = newAnswer
    bar.tick()
  }

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
