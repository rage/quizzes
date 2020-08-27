import Model from "./base_model"
import User from "./user"
import Knex from "knex"
import Course from "./course"

class UserCoursePartState extends Model {
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
        .sum("points_awarded as pointsAwarded")
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
            score: pointsAwarded,
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
      await userCoursePartState
        .$query(trx)
        .patch({ score: pointsAwarded, progress: pointsAwarded / totalPoints })
    }
  }
}

export default UserCoursePartState
