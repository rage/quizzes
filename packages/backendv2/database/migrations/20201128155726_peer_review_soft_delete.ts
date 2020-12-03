import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review_collection", table => {
    table
      .boolean("deleted")
      .defaultTo(false)
      .notNullable()
  })

  await knex.schema.table("peer_review_question", table => {
    table
      .boolean("deleted")
      .defaultTo(false)
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review_collection", table => {
    table.dropColumn("deleted")
  })

  await knex.schema.table("peer_review_question", table => {
    table.dropColumn("deleted")
  })
}
