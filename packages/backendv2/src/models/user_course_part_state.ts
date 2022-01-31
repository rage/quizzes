import User from "./user"
import Knex from "knex"
import Course from "./course"
import { PointsByGroup } from "../types"
import Quiz from "./quiz"
import BaseModel from "./base_model"

class UserCoursePartState extends BaseModel {
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
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "user_course_part_state.user_id",
        to: "user.id",
      },
    },
    quiz: {
      relation: BaseModel.BelongsToOneRelation,
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
        .select("part as course_part")
        .select(trx.raw("coalesce(sum(points_awarded), 0) as points_awarded"))
        .sum("points as total_points")
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

      const userCoursePartStateUpsertObjects = parts.map(
        ({ course_part, points_awarded, total_points }) => {
          return {
            user_id: userId,
            course_id: courseId,
            course_part: course_part,
            score: Number(points_awarded) || 0,
            progress:
              total_points === 0
                ? 0
                : Number(points_awarded) / Number(total_points),
          }
        },
      )
      return await this.query(trx).upsertGraphAndFetch(
        userCoursePartStateUpsertObjects,
      )
    } else {
      const result: { [key: string]: number } = (
        await trx("quiz")
          .sum("points_awarded as pointsAwarded")
          .sum("points as totalPoints")
          .join("user_quiz_state", "quiz.id", "user_quiz_state.quiz_id")
          .where("course_id", courseId)
          .andWhere("part", coursePart)
          .andWhere("user_id", userId)
      )[0]

      await userCoursePartState.$query(trx).patch({
        score: result.pointsAwarded || 0,
        progress: result.pointsAwarded
          ? result.pointsAwarded / result.totalPoints
          : 0,
      })
    }
  }

  public static async getProgress(
    userId: number,
    courseId: string,
    trx: Knex.Transaction,
  ): Promise<PointsByGroup[]> {
    try {
      // course validation
      await Course.getFlattenedById(courseId)
      await User.getById(userId)

      const userCoursePartStates = await this.query(trx)
        .where({
          user_id: userId,
          course_id: courseId,
        })
        .andWhereNot("course_part", 0)

      const quizzes = await Quiz.query(trx)
        .where("course_id", courseId)
        .andWhereNot("part", 0)

      const quizGroups: { [part: string] : Quiz[] } = {}
      quizzes.forEach(quiz => {
        quizGroups[quiz.part] = quizGroups[quiz.part] ?? []
        quizGroups[quiz.part].push(quiz)
      })
      const courseParts: number[] = Object.keys(quizGroups).map(key => parseInt(key)).sort()
      const progress: PointsByGroup[] = courseParts.map(part => {
        const maxPoints = quizGroups[part].map(quiz => quiz.points).reduce((a, b) => a + b)
        const userScoreList = userCoursePartStates.filter(ucps => ucps.coursePart == part)
                                              .map(ucps => ucps.score)
        const userScore = userScoreList.length > 0 ? userScoreList.reduce((a, b) => a + b) : 0
        const groupString = `${part < 10 ? "osa0" : "osa"}${part}`

        return {
          group: groupString,
          progress: Math.round((userScore / maxPoints) * 100) / 100,
          n_points: Number(userScore.toFixed(2)),
          max_points: maxPoints
        }
      })

      return progress.sort((pbg1, pbg2) =>
        pbg1.group < pbg2.group ? -1 : pbg1.group > pbg2.group ? 1 : 0,
      )
    } catch (error) {
      throw error
    }
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
