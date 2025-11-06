import * as Knex from "knex"

const moveQuizOptionAnswerRows = `
    ALTER TABLE quiz_item_answer
        DISABLE TRIGGER ALL;
    ALTER TABLE quiz_option_answer
        DISABLE TRIGGER ALL;

    SET random_page_cost = 1.1;

    DROP INDEX IF EXISTS idx_fts_answer;
    DROP INDEX IF EXISTS quiz_item_answer_sort_order;
    DROP INDEX IF EXISTS trgm_idx;

    INSERT
    INTO quiz_item_answer as qia (id, quiz_answer_id, quiz_item_id, int_data, created_at, updated_at)
    SELECT qoa.id, qia.quiz_answer_id, qoa.quiz_option_id, 1, qoa.created_at, qoa.updated_at
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

    DELETE
    FROM quiz_item_answer qia
    WHERE id IN (SELECT id from qia_to_delete);

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

    ALTER TABLE quiz_item
        DISABLE TRIGGER ALL;
        
    DELETE
    FROM quiz_option qo
        USING quiz_item qi
    WHERE qi.type = 'checkbox';

    DELETE 
    FROM quiz_item qi
        WHERE qi.id IN (SELECT id FROM qi_to_delete);
    

    ALTER TABLE quiz_option
        ENABLE TRIGGER ALL;

    ALTER TABLE quiz_item
        ENABLE TRIGGER ALL;
`

const reCreateIndexes = `

CREATE INDEX idx_fts_answer
    ON quiz_item_answer using gin (to_tsvector('english'::regconfig, COALESCE(text_data, ''::text)));

CREATE INDEX quiz_item_answer_sort_order
    ON quiz_item_answer (quiz_answer_id, created_at);
`

const createTempTables = `
CREATE TEMP TABLE qia_to_delete(
    id uuid
);

CREATE TEMP TABLE qi_to_delete(
    id uuid
);

insert into qia_to_delete (select qia.id
      from quiz_item_answer qia
               join quiz_item qi on qi.id = qia.quiz_item_id
               join quiz_option_answer qoa on qoa.quiz_item_answer_id = qia.id
               where qi.type ='checkbox');

insert into qi_to_delete (select qi.id
      from quiz_item qi
               join quiz_option qo on qo.quiz_item_id = qi.id
               where qi.type ='checkbox');
`

const dropTempTables = `
    DROP TABLE IF EXISTS qia_to_delete;
    DROP TABLE IF EXISTS qi_to_delete;
`

export async function up(knex: Knex): Promise<void> {
  await knex.raw(createTempTables)
  await knex.raw(moveQuizOptionAnswerRows)
  await knex.raw(moveQuizOptionTranslationRows)
  await knex.raw(moveQuizOptionRows)
  await knex.raw(dropTempTables)
  await knex.raw(reCreateIndexes)
}

export async function down(knex: Knex): Promise<void> {}
