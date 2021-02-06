import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_answer", table => {
    table
      .boolean("deleted")
      .defaultTo(false)
      .notNullable()
    table
      .double("correctness_coefficient")
      .defaultTo(0)
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_answer", table => {
    table.dropColumn("deleted")
    table.dropColumn("correctness_coefficient")
  })
}
