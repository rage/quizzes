import * as Knex from "knex"

const addAnswerIndex = `
ALTER TABLE public.quiz_item_answer ADD "document" tsvector;

update public.quiz_item_answer set document = to_tsvector(coalesce(text_data, ''));

CREATE FUNCTION answer_trigger_function()
RETURNS trigger AS $$
BEGIN
  NEW.document := to_tsvector(coalesce(text_data, ''));
  RETURN NEW;
END $$ LANGUAGE 'plpgsql';

CREATE TRIGGER my_trigger
BEFORE INSERT ON public.quiz_item_answer
FOR EACH ROW
EXECUTE PROCEDURE answer_trigger_function();
CREATE INDEX idx_fts_answer ON public.quiz_item_answer USING gin(document);
`

export async function up(knex: Knex): Promise<any> {
  await knex.schema.raw(addAnswerIndex)
}

export async function down(knex: Knex): Promise<any> {}
