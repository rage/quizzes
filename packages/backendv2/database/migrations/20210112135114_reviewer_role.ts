import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `create type role_enum_new as enum ('assistant', 'teacher', 'reviewer')`,
  )
  await knex.raw(
    "alter table user_course_role alter column role set data type role_enum_new using (role::text::role_enum_new)",
  )
  await knex.raw("drop type role_enum")
  await knex.raw("alter type role_enum_new rename to role_enum")
}

export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
        ALTER TYPE role_enum DROP VALUE 'reviewer'
    `)
}
