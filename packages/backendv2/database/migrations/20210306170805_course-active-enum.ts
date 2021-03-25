import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("course", table => {
    table
      .enu("status", ["active", "ended"], {
        useNative: true,
        enumName: "course_active_status_enum",
      })
      .defaultTo("active")
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("course", table => {
    table.dropColumn("status")
  })
}
