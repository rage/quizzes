import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("kafka_message", table => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()

    table.string("topic").notNullable()

    table.text("message").notNullable()

    table
      .timestamp("created_at", { useTz: false })
      .defaultTo(knex.fn.now())
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("kafka_message")
}
