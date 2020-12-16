import knex, { pool } from "../database/knex"
import {} from "../src/models"

export default async function recalculate(courseId: string, passToCaller: any) {
  const pgClient = await pool.connect()
  const started = new Date().getSeconds()
  let cancelled = false
  passToCaller({
    report: () => new Date().getSeconds() - started + " s",
    cancel: async () => {
      cancelled = true
      const pgCancel = await pool.connect()
      await pgCancel.query("SELECT pg_cancel_backend($1)", [pgClient.processID])
      pgClient.release()
      pgCancel.release()
    },
  })
  try {
    await pgClient.query(
      `
      INSERT INTO
      user_course_part_state(user_id, course_id, course_part, progress, score)
      SELECT
          parts.user_id AS user_id,
          parts.course_id AS course_id,
          parts.part AS course_part,
          coalesce(
              CASE
                  WHEN max.max_points IS NOT NULL
                  AND max.max_points > 0 THEN (points.points / max.max_points)
              END,
              0
          ) AS progress,
          coalesce(points.points, 0) AS score
      FROM
          (
              SELECT
                  DISTINCT ON (uqs.user_id, q.part) uqs.user_id,
                  q.part,
                  q.course_id
              FROM
                  user_quiz_state uqs
                  CROSS JOIN quiz q
              WHERE
                  q.course_id = $ 1
                  AND uqs.quiz_id IN (
                      SELECT
                          id
                      FROM
                          quiz
                      WHERE
                          course_id = $ 1
                  )
          ) AS parts
          LEFT JOIN (
              SELECT
                  q.course_id,
                  uqs.user_id,
                  q.part,
                  sum(uqs.points_awarded) AS points
              FROM
                  user_quiz_state uqs
                  JOIN quiz q ON uqs.quiz_id = q.id
              WHERE
                  q.course_id = $ 1
                  AND q.excluded_from_score = false
              GROUP BY
                  q.course_id,
                  uqs.user_id,
                  q.part
          ) AS points ON parts.course_id = points.course_id
          AND parts.user_id = points.user_id
          AND parts.part = points.part
          LEFT JOIN (
              SELECT
                  q.course_id,
                  q.part,
                  sum(q.points) AS max_points
              FROM
                  quiz q
              WHERE
                  q.course_id = $ 1
                  AND q.excluded_from_score = false
              GROUP BY
                  q.course_id,
                  q.part
          ) AS max ON parts.part = max.part
          AND parts.course_id = max.course_id ON conflict (user_id, course_id, course_part) DO
      UPDATE
      SET
          progress = excluded.progress,
          score = excluded.score
      `,
      [courseId],
    )
    console.log("recalc_" + courseId + " done")
  } catch (error) {
    if (cancelled) {
      console.log("recalc terminated")
    } else {
      console.log("error while recalculating progress")
      throw error
    }
  }
}
