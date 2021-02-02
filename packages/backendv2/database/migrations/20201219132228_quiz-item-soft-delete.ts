import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table
      .boolean("deleted")
      .defaultTo(false)
      .notNullable()
  })

  await knex.schema.table("quiz_option", table => {
    table
      .boolean("deleted")
      .defaultTo(false)
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table.dropColumn("deleted")
  })

  await knex.schema.table("quiz_option", table => {
    table.dropColumn("deleted")
  })
}
