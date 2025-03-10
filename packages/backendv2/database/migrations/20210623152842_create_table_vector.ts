import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    create table vector
        (
            id             uuid primary key default uuid_generate_v4(),
            quiz_answer_id uuid not null,
            vector         text not null,
            foreign key (quiz_answer_id)
                references quiz_answer
        );
    `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("drop table vector;")
}
