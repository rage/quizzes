import knex from "../database/knex"
import Knex from "knex"

const update_expired_courses = async (client: Knex) => {
  await client.raw(`
        update course as c
        set status = 'ended'
        from (
            select result.course_id
              from (select max(qa.created_at) as latest_course_submission, q.course_id as course_id
                    from quiz_answer qa
                            left join quiz q on qa.quiz_id = q.id
                    group by q.course_id) as result
              where now() - result.latest_course_submission >= interval '1 year'
            ) as ended_courses
        where ended_courses.course_id = c.id;
    `)
}
;(async () => {
  try {
    await update_expired_courses(knex)
  } catch (err) {
    console.error("Failed to update expired courses:", err)
  }
})()
