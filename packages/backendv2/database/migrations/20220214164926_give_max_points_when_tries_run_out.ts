import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz", table => {
    table
      .boolean("give_max_points_when_tries_run_out")
      .defaultTo(false)
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz", table => {
    table.dropColumn("give_max_points_when_tries_run_out")
  })
}
