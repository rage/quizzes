import Quiz from "./quiz"
import User from "./user"
import QuizAnswer from "./quiz_answer"
import Knex, { Transaction } from "knex"
import BaseModel from "./base_model"
import knex from "../../database/knex"
import { ModelObject } from "objection"

class UserQuizState extends BaseModel {
  userId!: number
  quizId!: string
  tries!: number
  status!: "open" | "locked"
  pointsAwarded!: number | null
  peerReviewsGiven!: number
  peerReviewsReceived!: number | null
  spamFlags!: number | null
  createdAt!: string

  static get tableName() {
    return "user_quiz_state"
  }

  static get idColumn() {
    return ["user_id", "quiz_id"]
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    quiz: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "user_quiz_state.quiz_id",
        to: "quiz.id",
      },
    },
    quizAnswer: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizAnswer,
      join: {
        from: ["user_quiz_state.user_id", "user_quiz_state.quiz_id"],
        to: ["quiz_answer.user_id", "quiz_answer.quiz_id"],
      },
    },
  }

  public static async getByUserAndQuiz(
    userId: number,
    quizId: string,
    trx?: Knex.Transaction,
  ): Promise<UserQuizState> {
    return await this.query(trx).findById([userId, quizId])
  }

  public static async getByUserAndCourse(
    userId: number,
    courseId: string,
    trx?: Knex.Transaction,
  ): Promise<UserQuizState[]> {
    const result = await this.query(trx)
      .from("user_quiz_state")
      .join("quiz", "user_quiz_state.quiz_id", "quiz.id")
      .join("course", "quiz.course_id", "course.id")
      .select("user_quiz_state.quiz_id")
      .select("user_quiz_state.peer_reviews_given")
      .select("user_quiz_state.peer_reviews_received")
      .select("user_quiz_state.tries")
      .select("user_quiz_state.points_awarded")
      .select("user_quiz_state.status")
      .where("user_id", userId)
      .where("course_id", courseId)

    return result
  }

  public static async save(
    userQuizState: UserQuizState,
    trx: any,
  ): Promise<UserQuizState> {
    return await this.query(trx).insertGraphAndFetch(userQuizState)
  }

  public static async upsert(
    userQuizState: UserQuizState,
    trx: any,
  ): Promise<UserQuizState> {
    if (!userQuizState.createdAt) {
      return await this.query(trx).insertAndFetch(userQuizState)
    }
    const { userId, quizId, ...data } = userQuizState
    return await this.query(trx).updateAndFetchById([userId, quizId], data)
  }

  public static async updateAwardedPointsForQuiz(
    oldQuiz: Quiz,
    newQuiz: Quiz,
    trx: Knex.Transaction,
  ) {
    const oldMaxPoints = oldQuiz.points
    const maxPoints = newQuiz.points

    await trx("user_quiz_state")
      .update({
        points_awarded:
          oldMaxPoints === 0
            ? trx.raw(":maxPoints", { maxPoints })
            : trx.raw("(points_awarded * :oldMaxPoints / :maxPoints)", {
                maxPoints,
                oldMaxPoints,
              }),
      })
      .where({ quiz_id: newQuiz.id })
  }

  // public static async updateAwardedPoints(
  //   maxPoints: number,
  //   nextBestCorrectnessCoefficient: number,
  //   trx: Transaction,
  // ) {
  //   await trx("user_quiz_state").update({
  //     points_awarded: maxPoints * nextBestCorrectnessCoefficient,
  //   })
  // }
}

export type UserQuizStateType = ModelObject<UserQuizState>

export default UserQuizState
