import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  return await knex.schema.createTable("course", table => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .notNullable()
  })
}
