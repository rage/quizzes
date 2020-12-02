import * as Knex from "knex"

const addAnswerIndex = `
CREATE INDEX idx_fts_answer ON public.quiz_item_answer USING gin (to_tsvector('english', coalesce(text_data, '')));
`

const removeAnswerIndex = `
  DROP INDEX IF EXISTS idx_fts_answer;
`

export async function up(knex: Knex): Promise<any> {
  if (process.env.NODE_ENV !== "test") {
    await knex.schema.raw(addAnswerIndex)
  }
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.raw(removeAnswerIndex)
}
