import knex, { pool } from "../database/knex"
import {} from "../src/models"

export default async function recalculate(courseId: string, passToCaller: any) {
  const pgClient = await pool.connect()
  const started = new Date().getSeconds()
  passToCaller({
    report: () => new Date().getSeconds() - started + " s",
    cancel: async () => {
      const pgCancel = await pool.connect()
      await pgCancel.query("SELECT pg_cancel_backend($1)", [pgClient.processID])
      pgClient.release()
      pgCancel.release()
    },
  })
  try {
    await pgClient.query(
      `
          insert into user_course_part_state(user_id, course_id, course_part, progress, score)
          select
            parts.user_id as user_id,
            parts.course_id as course_id,
            parts.part as course_part,
            coalesce(
              case when max.max_points is not null and max.max_points > 0 then (points.points / max.max_points) end, 0
            ) as progress,
            coalesce(points.points, 0) as score
          from (
            select distinct on (uqs.user_id, q.part)
              uqs.user_id,
              q.part,
              q.course_id
            from user_quiz_state uqs
            cross join quiz q
            where q.course_id = $1
            and uqs.quiz_id in (
              select
                id
              from quiz
              where course_id = $1
            )
          ) as parts
          left join (
            select
              q.course_id,
              uqs.user_id,
              q.part,
              sum(uqs.points_awarded) as points
            from user_quiz_state uqs
            join quiz q on uqs.quiz_id = q.id
            where q.course_id = $1
            and q.excluded_from_score = false
            group by q.course_id, uqs.user_id, q.part
          ) as points
          on parts.course_id = points.course_id
          and parts.user_id = points.user_id
          and parts.part = points.part
          left join (
            select
              q.course_id,
              q.part,
              sum(q.points) as max_points
            from quiz q
            where q.course_id = $1
            and q.excluded_from_score = false
            group by q.course_id, q.part
          ) as max
          on parts.part = max.part and parts.course_id = max.course_id
          on conflict (user_id, course_id, course_part)
          do update
          set progress = excluded.progress, score = excluded.score
          `,
      [courseId],
    )
    console.log("recalc_" + courseId + " done")
  } catch (error) {
    console.log("error while recalculating progress")
    throw error
  }
}
