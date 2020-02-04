import knex from "../config/knex"

const update = async () => {
  try {
    console.time("done in")
    console.log(new Date())

    const dateString = (await knex("migration")
      .select("date")
      .orderBy("date", "desc")
      .limit(2))[1].date
    const date = new Date(dateString).toISOString()

    const courses = `
            ('21356a26-7508-4705-9bab-39b239862632',
            '5d1e8da2-3154-4966-aa94-2ca0406cf38a',
            '5f496ecc-327a-4899-baff-2daa2b40b05f',
            '5bfa04ac-30b9-49d9-a171-2c140f11f9a7',
            '5bbd7d17-3099-48cb-a8c2-2bf70d0ea375')
        `
    const quizzes = `
            (select
                    id
            from quiz
            where course_id in ${courses})
        `

    console.log(`updating data received since ${date}`)

    console.log("updating open answers")
    await knex.raw(`
            update quiz_item_answer
            set correct = v.is_correct from (
                select
                    qia.id,
                    qia.text_data ~ qi.validity_regex as is_correct
                from quiz_item_answer qia
                join quiz_item qi on qia.quiz_item_id = qi.id
                where qi.type = 'open'
                and qia.correct is null
                and qia.created_at >= '${date}'
                and qi.quiz_id in ${quizzes}
            ) as v
            where quiz_item_answer.id = v.id
        `)

    console.log("updating multiple choice answers")
    await knex.raw(`
            update quiz_item_answer
            set correct = v.correct
            from (
                select
                    qia.id,
                    qo.correct
                from quiz_item_answer qia
                join quiz_option_answer qoa on qia.id = qoa.quiz_item_answer_id
                join quiz_option qo on qoa.quiz_option_id = qo.id
                join quiz_item qi on qia.quiz_item_id = qi.id
                where qi.type = 'multiple-choice'
                and qia.correct is null
                and qia.created_at >= '${date}'
                and qi.quiz_id in ${quizzes}
                and multi = false
            ) as v
            where quiz_item_answer.id = v.id
        `)

    console.log("updating multiple choice all that apply answers")
    await knex.raw(`
            update quiz_item_answer
            set correct = case when v.correct = v.total and v.false = 0 then true else false end
            from (
                select
                    qia.id,
                    coalesce(c.correct, 0) correct,
                    coalesce(f.false, 0) as false,
                    coalesce(t.total_correct, 0) total
                from quiz_item_answer qia
                join quiz_item qi on qia.quiz_item_id = qi.id
                left join (
                    select
                        qia.id,
                        count(qoa.id) correct
                    from quiz_item_answer qia
                    join quiz_option_answer
                    qoa on qia.id = qoa.quiz_item_answer_id
                    join quiz_option qo on qoa.quiz_option_id = qo.id
                    where qo.correct = true
                    group by qia.id
                ) c on qia.id = c.id
                left join (
                    select
                        qia.id,
                        count(qoa.id) as false
                    from quiz_item_answer qia
                    join quiz_option_answer qoa on qia.id = qoa.quiz_item_answer_id
                    join quiz_option qo on qoa.quiz_option_id = qo.id
                    where qo.correct = false
                    group by qia.id
                ) f on qia.id = f.id
                left join (
                    select
                        qi.id,
                        count(qo.id) total_correct
                    from quiz_item qi
                    join quiz_option qo on qi.id = qo.quiz_item_id
                    where correct = true
                    group by qi.id
                ) t on qia.quiz_item_id = t.id
                where qi.quiz_id in ${quizzes}
                and qia.correct is null
                and qia.created_at >= '${date}'
                and qi.multi = true
            ) as v where quiz_item_answer.id = v.id
        `)

    console.log("updating essay answers")
    await knex.raw(`
            update quiz_item_answer
            set correct =
                case
                    when v.status = 'confirmed'
                    then true
                    when v.status = 'rejected' or v.status = 'spam'
                    then false
                end
            from (
                select
                    qia.id,
                    qa.status
                from quiz_item_answer qia
                join quiz_answer qa on qia.quiz_answer_id = qa.id
                join quiz_item qi on qia.quiz_item_id = qi.id
                where qi.type = 'essay'
                and qia.correct is null
                and qi.quiz_id in ${quizzes}
                and (qia.created_at >= '${date}' or qia.updated_at >= '${date}')
            ) as v
            where quiz_item_answer.id = v.id;
        `)
    console.timeEnd("done in")
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

update()
