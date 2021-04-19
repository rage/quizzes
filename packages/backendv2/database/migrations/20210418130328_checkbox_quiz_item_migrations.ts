import * as Knex from "knex"

const moveQuizOptionAnswerRows = `
    WITH moved_quiz_option_answer_rows AS (
        DELETE FROM quiz_option_answer qoa
            USING quiz_item_answer qia
        WHERE qia.quiz_item_id IN (SELECT id FROM quiz_item WHERE type = 'checkbox')
        RETURNING qoa.id, qia.quiz_answer_id, qoa.quiz_option_id
    )
    
    INSERT INTO quiz_item_answer (id, quiz_answer_id, quiz_item_id)
    SELECT * FROM moved_quiz_option_answer_rows

`

const moveQuizOptionRows = `
    WITH moved_quiz_option_rows AS (
        DELETE FROM quiz_option qo
            USING quiz_item qi
        WHERE qi.type = 'checkbox'
        RETURNING qo.id, qo."order", qo.deleted, 'checkbox'::quiz_item_type_enum, qi.quiz_id  
    )

    INSERT INTO quiz_item (id, "order", deleted, type, quiz_id) 
    SELECT * FROM moved_quiz_option_rows

`

const deleteQuizOptionChildren = `
    DELETE FROM quiz_option_translation qot
        USING quiz_item qi, quiz_option qo
        WHERE qo.id IN (SELECT id FROM quiz_item WHERE type = 'checkbox'::quiz_item_type_enum);
`

const reEnableTableTriggers = `
ALTER TABLE quiz_option_answer ENABLE TRIGGER ALL
ALTER TABLE quiz_option ENABLE TRIGGER ALL
`

const disableTableTriggers = `
ALTER TABLE quiz_option_answer DISABLE TRIGGER ALL
ALTER TABLE quiz_option DISABLE TRIGGER ALL 

`

export async function up(knex: Knex): Promise<void> {
  await knex.raw(disableTableTriggers)
  await knex.raw(moveQuizOptionAnswerRows)
  await knex.raw(deleteQuizOptionChildren)
  await knex.raw(moveQuizOptionRows)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(reEnableTableTriggers)
}
