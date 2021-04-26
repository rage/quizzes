import * as Knex from "knex"

const moveQuizOptionAnswerRows = `
    ALTER TABLE quiz_item_answer
        DISABLE TRIGGER ALL;
    ALTER TABLE quiz_option_answer
        DISABLE TRIGGER ALL;

    SET random_page_cost = 1.1;

    DROP INDEX idx_fts_answer;
    DROP INDEX quiz_item_answer_sort_order;
    DROP INDEX trgm_idx;

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

    ALTER TABLE quiz_item_answer
        ENABLE TRIGGER ALL;
    ALTER TABLE quiz_option_answer
        ENABLE TRIGGER ALL;

`

const moveQuizOptionTranslationRows = `
    ALTER TABLE quiz_item_translation
        DISABLE TRIGGER ALL;

    INSERT
    INTO quiz_item_translation as qia (quiz_item_id, language_id, title, body, success_message, failure_message, created_at,
                                       updated_at)
    SELECT qot.quiz_option_id,
           qot.language_id,
           qot.title,
           qot.body,
           qot.success_message,
           qot.failure_message,
           qot.created_at,
           qot.updated_at
    FROM quiz_option_translation as qot
             JOIN quiz_option qo on qot.quiz_option_id = qo.id
    WHERE qo.quiz_item_id IN (SELECT id FROM quiz_item WHERE type = 'checkbox');

    DELETE
    FROM quiz_option_translation qot
        USING quiz_option qo
    WHERE qo.quiz_item_id IN (SELECT id FROM quiz_item WHERE type = 'checkbox');

    ALTER TABLE quiz_item_translation
        ENABLE TRIGGER ALL;
`

const moveQuizOptionRows = `
    INSERT
    INTO quiz_item (id, "order", deleted, type, quiz_id, created_at, updated_at)
    SELECT qo.id, qo."order", qo.deleted, 'checkbox'::quiz_item_type_enum, qi.quiz_id, qo.created_at, qo.updated_at
    FROM quiz_option qo
            JOIN quiz_item qi ON qo.quiz_item_id = qi.id
    WHERE qi.type = 'checkbox';

    ALTER TABLE quiz_option
        DISABLE TRIGGER ALL;
        
    DELETE
    FROM quiz_option qo
        USING quiz_item qi
    WHERE qi.type = 'checkbox';

    ALTER TABLE quiz_option
        ENABLE TRIGGER ALL;
`

const reCreateIndexes = `
create index trgm_idx
    on quiz_item_answer using gin (text_data gin_trgm_ops);

create index idx_fts_answer
    on quiz_item_answer using gin (to_tsvector('english'::regconfig, COALESCE(text_data, ''::text)));

create index quiz_item_answer_sort_order
    on quiz_item_answer (quiz_answer_id, created_at);

`

export async function up(knex: Knex): Promise<void> {
  await knex.raw(moveQuizOptionAnswerRows)
  await knex.raw(moveQuizOptionTranslationRows)
  await knex.raw(moveQuizOptionRows)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(reCreateIndexes)
}
