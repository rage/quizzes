import * as Knex from "knex"

// indexes on the foreign key fields in referencing tables
const createAnswerIdIndexQia = `
 CREATE INDEX quiz_item_answer_quiz_answer_id
    ON quiz_item_answer(quiz_answer_id);
`
const createItemIdIndexQia = `
 CREATE INDEX quiz_item_answer_quiz_item_id
    ON quiz_item_answer(quiz_item_id);
`

const createItemIdIndexQo = `
 CREATE INDEX quiz_option_quiz_item_id
    ON quiz_option(quiz_item_id);
`

const dropIndexes = `
    DROP INDEX quiz_item_answer_quiz_answer_id;
    DROP INDEX quiz_item_answer_quiz_item_id;
    DROP INDEX quiz_option_quiz_item_id;
`

const moveQuizOptionAnswerRows = `
    WITH moved_quiz_option_answer_rows AS (
        DELETE FROM quiz_option_answer qoa
            USING quiz_item_answer qia
        WHERE qia.quiz_item_id IN (SELECT id FROM quiz_item WHERE type = 'checkbox')
        RETURNING qoa.id, qia.quiz_answer_id, qoa.quiz_option_id
    )

    INSERT INTO quiz_item_answer (id, quiz_answer_id, quiz_item_id)
    SELECT * FROM moved_quiz_option_answer_rows;
`

const moveQuizOptionRows = `
    WITH moved_quiz_option_rows AS (
        DELETE FROM quiz_option qo
            USING quiz_item qi
        WHERE qi.type = 'checkbox'
        RETURNING qo.id, qo."order", qo.deleted, 'checkbox'::quiz_item_type_enum, qi.quiz_id  
    )

    INSERT INTO quiz_item (id, "order", deleted, type, quiz_id) 
    SELECT * FROM moved_quiz_option_rows;
`
const deleteQuizOptionChildren = `
    DELETE FROM quiz_option_translation qot
        USING quiz_item qi, quiz_option qo
        WHERE qo.id IN (SELECT id FROM quiz_item WHERE type = 'checkbox'::quiz_item_type_enum);
`

export async function up(knex: Knex): Promise<void> {
  await knex.raw(createAnswerIdIndexQia)
  await knex.raw(createItemIdIndexQia)
  await knex.raw(createItemIdIndexQo)
  await knex.raw(moveQuizOptionAnswerRows)
  await knex.raw(deleteQuizOptionChildren)
  await knex.raw(moveQuizOptionRows)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(dropIndexes)
}
