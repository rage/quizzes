import type { Knex } from "knex"

// Production already has this table from the v1 backend's TypeORM migrations,
// so creation must be a no-op there.
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    create table if not exists kafka_task (
      id uuid default uuid_generate_v4 (),
      course_id uuid references course(id),
      quiz_id uuid references quiz(id),
      recalculate_progress boolean default false,
      created_at timestamp with time zone default current_timestamp,
      user_id integer,
      primary key (id)
    )
  `)
}

// Dropping would destroy the production table this migration did not create.
export async function down(): Promise<void> {}
