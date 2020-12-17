import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    "create table background_task(id uuid primary key not null default uuid_generate_v4(), type text, depends_on uuid, course_id uuid, quiz_id uuid)",
  )
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("drop table background_task")
}