import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review", table => {
    table.index("user_id")
  })
  await knex.schema.table("quiz_answer", table => {
    table.index(["quiz_id", "status"])
    table.index(["user_id", "quiz_id"])
  })
  await knex.schema.table("spam_flag", table => {
    table.index("user_id")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("peer_review", table => {
    table.dropIndex("user_id")
  })
  await knex.schema.table("quiz_answer", table => {
    table.dropIndex(["quiz_id", "status"])
    table.dropIndex(["user_id", "quiz_id"])
  })
  await knex.schema.table("spam_flag", table => {
    table.dropIndex("user_id")
  })
}
