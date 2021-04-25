import * as Knex from "knex"

const moveQuizOptionAnswerRows = `
    DROP INDEX idx_fts_answer;
    DROP INDEX trgm_idx;
    DROP INDEX quiz_option_answer_sort_order;

    SET random_page_cost = 1.1;

    INSERT
    INTO quiz_item_answer as qia (id, quiz_answer_id, quiz_item_id, created_at, updated_at)
    SELECT qoa.id, qia.quiz_answer_id, qoa.quiz_option_id, qoa.created_at, qoa.updated_at
    FROM quiz_option_answer as qoa
            JOIN quiz_item_answer qia on qia.id = qoa.quiz_item_answer_id
            JOIN quiz_item qi on qi.id = qia.quiz_item_id
    WHERE qi.type = 'checkbox';

    DELETE
    FROM quiz_option_answer as qoa
    WHERE id IN (SELECT qoa.id
             from quiz_option_answer qoa
                      join quiz_option qo on qo.id = qoa.quiz_option_id
                      join quiz_item qi on qi.id = qo.quiz_item_id
             where qi.type = 'checkbox');

    SET random_page_cost = 4;

    create index trgm_idx
	    on quiz_item_answer using gin (text_data gin_trgm_ops);

    create index idx_fts_answer
        on quiz_item_answer using gin (to_tsvector('english'::regconfig, COALESCE(text_data, ''::text)));

    create index quiz_item_answer_sort_order
	    on quiz_item_answer (quiz_answer_id, created_at);
`

const moveQuizOptionTranslationRows = `
    WITH moved_quiz_option_translation_rows AS (
        DELETE FROM quiz_option_translation qot
            USING quiz_option qo 
        WHERE qo.quiz_item_id IN (SELECT id FROM quiz_item WHERE type = 'checkbox')
        RETURNING qot.quiz_option_id, qot.language_id, qot.title, qot.body, qot.success_message, qot.failure_message
    )
    
    INSERT INTO quiz_item_translation (quiz_item_id, language_id, title, body, success_message, failure_message)
    SELECT * FROM moved_quiz_option_translation_rows
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

const disableTableTriggers = `
ALTER TABLE quiz_option_answer
    DISABLE TRIGGER ALL;
ALTER TABLE quiz_item
    DISABLE TRIGGER ALL;
ALTER TABLE quiz_item_answer
    DISABLE TRIGGER ALL;
`
const reEnableTableTriggers = `
ALTER TABLE quiz_option_answer
    ENABLE TRIGGER ALL;
ALTER TABLE quiz_item
    ENABLE TRIGGER ALL;
ALTER TABLE quiz_item_answer
    ENABLE TRIGGER ALL;
`

export async function up(knex: Knex): Promise<void> {
  await knex.raw(disableTableTriggers)
  await knex.raw(moveQuizOptionAnswerRows)
  await knex.raw(moveQuizOptionTranslationRows)
  await knex.raw(moveQuizOptionRows)
  await knex.raw(reEnableTableTriggers)
}

export async function down(knex: Knex): Promise<void> {}
