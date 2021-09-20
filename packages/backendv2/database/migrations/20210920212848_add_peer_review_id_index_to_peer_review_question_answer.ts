import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review_question_answer", table => {
    table.index("peer_review_id")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review_question_answer", table => {
    table.dropIndex("peer_review_id")
  })
}
