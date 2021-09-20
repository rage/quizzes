import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review", table => {
    table.index("quiz_answer_id")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review", table => {
    table.dropIndex("quiz_answer_id")
  })
}
