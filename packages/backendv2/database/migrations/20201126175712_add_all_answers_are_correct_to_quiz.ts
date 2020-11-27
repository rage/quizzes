import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table
      .boolean("all_answers_correct")
      .defaultTo(false)
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table.dropColumn("all_answers_correct")
  })
}
