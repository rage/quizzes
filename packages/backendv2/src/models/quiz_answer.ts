import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import { UserInfo } from "../types"
import UserQuizState from "./user_quiz_state"
import Quiz from "./quiz"
import { SubmissionError } from "../util/error"

class QuizAnswer extends Model {
  id!: string
  quizId!: string

  static get tableName() {
    return "quiz_answer"
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    itemAnswers: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
  }

  public static async saveQuizAnswer(user: UserInfo, answer: any) {
    const userId = user.id
    const quizId = answer.quizId
    const isUserInDb = await User.getById(userId)
    if (!isUserInDb) {
      answer.user = { id: userId }
    }
    const quiz = await Quiz.getById(quizId)
    const userQuizState =
      (await UserQuizState.getByUserAndQuiz(userId, quizId)) ??
      UserQuizState.fromJson({ userId, quizId })
    this.checkIfSubmittable(quiz, userQuizState)
    return {}
  }

  private static checkIfSubmittable(quiz: Quiz, userQuizState: UserQuizState) {
    if (quiz.deadline && quiz.deadline < new Date()) {
      throw new SubmissionError("no submission past deadline")
    }
    if (quiz.triesLimited && userQuizState.tries >= quiz.tries) {
      throw new SubmissionError("no tries left")
    }
  }
}

export default QuizAnswer
