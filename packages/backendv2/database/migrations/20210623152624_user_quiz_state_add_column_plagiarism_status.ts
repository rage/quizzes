import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`create type plagiarism_status_enum as enum('not-decided', 'confirmed-plagiarism', 'not-plagiarism');
    `)
  await knex.raw(
    "alter table user_quiz_state add column plagiarism_status plagiarism_status_enum;",
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`alter table user_quiz_state drop column plagiarism_status;`)
  await knex.raw(`drop type plagiarism_status_enum;`)
}
