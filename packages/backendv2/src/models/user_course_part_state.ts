import Model from "./base_model"
import User from "./user"
import Knex from "knex"
import Course from "./course"
import { PointsByGroup } from "../types"
import Quiz from "./quiz"

class UserCoursePartState extends Model {
  userId!: number
  courseId!: string
  coursePart!: number
  score!: number
  progress!: number

  static get tableName() {
    return "user_course_part_state"
  }

  static get idColumn() {
    return ["user_id", "course_id", "course_part"]
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "user_course_part_state.user_id",
        to: "user.id",
      },
    },
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: Course,
      join: {
        from: "user_course_part_state.course_id",
        to: "course.id",
      },
    },
  }

  public static async update(
    userId: number,
    courseId: string,
    coursePart: number,
    trx: Knex.Transaction,
  ) {
    const userCoursePartState = (
      await this.query(trx).findByIds([userId, courseId, coursePart])
    )[0]
    if (!userCoursePartState) {
      const parts = await trx("quiz")
        .select("part as coursePart")
        .select(trx.raw("coalesce(sum(points_awarded), 0) as pointsAwarded"))
        .sum("points as totalPoints")
        .leftJoin(
          trx.raw(
            `
            (
              SELECT
              user_id,
              quiz_id,
              points_awarded
              FROM user_quiz_state
              WHERE user_id = :userId
              AND quiz_id in (
                SELECT id
                FROM quiz
                WHERE course_id = :courseId
              )
            ) uqs
          `,
            { userId, courseId },
          ),
          "quiz.id",
          "uqs.quiz_id",
        )
        .where("course_id", courseId)
        .andWhereNot("part", 0)
        .groupBy("part")
      const userCoursePartStates = parts.map(
        ({ coursePart, pointsAwarded, totalPoints }) => {
          return this.fromJson({
            userId,
            courseId,
            coursePart,
            score: pointsAwarded || 0,
            progress: pointsAwarded / totalPoints,
          })
        },
      )
      await this.query(trx).insert(userCoursePartStates)
    } else {
      const { pointsAwarded, totalPoints } = (
        await trx("quiz")
          .sum("points_awarded as pointsAwarded")
          .sum("points as totalPoints")
          .join("user_quiz_state", "quiz.id", "user_quiz_state.quiz_id")
          .where("course_id", courseId)
          .andWhere("part", coursePart)
          .andWhere("user_id", userId)
      )[0]
      await userCoursePartState.$query(trx).patch({
        score: pointsAwarded || 0,
        progress: pointsAwarded ? pointsAwarded / totalPoints : 0 / totalPoints,
      })
    }
  }

  public static async getProgress(
    userId: number,
    courseId: string,
    trx: Knex.Transaction,
  ) {
    const userCoursePartStates = await this.query(trx)
      .where({
        user_id: userId,
        course_id: courseId,
      })
      .andWhereNot("course_part", 0)

    const quizzes = await Quiz.query(trx)
      .where("course_id", courseId)
      .andWhereNot("part", 0)

    const progress: PointsByGroup[] = userCoursePartStates.map(ucps => {
      const maxPoints = quizzes
        .filter(
          quiz =>
            quiz.part === ucps.coursePart && quiz.excludedFromScore === false,
        )
        .map(quiz => quiz.points)
        .reduce((acc, curr) => acc + curr, 0)

      const coursePartString = ucps.coursePart.toString()
      return {
        group: `${
          coursePartString.length > 1 ? "osa" : "osa0"
        }${coursePartString}`,
        progress: Math.floor(ucps.progress * 100) / 100,
        n_points: Number(ucps.score.toFixed(2)),
        max_points: maxPoints,
      }
    })

    return progress.sort((pbg1, pbg2) =>
      pbg1.group < pbg2.group ? -1 : pbg1.group > pbg2.group ? 1 : 0,
    )
  }

  public static async refreshCourse(userId: number, courseId: string) {
    const parts = await Course.getParts(courseId)
    await this.knex().transaction(async trx => {
      await Promise.all(
        parts.map(async part => {
          await this.update(userId, courseId, part, trx)
        }),
      )
    })
  }
}

export default UserCoursePartState
