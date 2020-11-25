import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    await knex.raw("DROP MATERIALIZED VIEW reaktor.quiz_item CASCADE")

    await knex.schema.alterTable("quiz_item", table => {
      table
        .enu("direction", ["column", "row"], {
          useNative: true,
          enumName: "quiz_item_direction_enum",
        })
        .notNullable()
        .defaultTo("row")
    })

    await knex.raw(`
        UPDATE quiz_item
        SET direction = 'column'
        WHERE quiz_id IN (
            SELECT quiz_id
            FROM (
                SELECT quiz_id, count(id)
                FROM quiz_item
                GROUP BY quiz_id
            ) c
            WHERE count = 1
        )
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_item AS
        SELECT *
        FROM quiz_item
        WHERE quiz_id IN (
            SELECT id
            FROM reaktor.quiz
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_item (id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_option AS
        SELECT *
        FROM quiz_option
        WHERE quiz_item_id IN (
            SELECT id
            FROM reaktor.quiz_item
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_option (id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_item_translation AS
        SELECT *
        FROM quiz_item_translation
        WHERE quiz_item_id IN (
            SELECT id
            FROM reaktor.quiz_item
        )  
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_item_translation (quiz_item_id, language_id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_option_translation AS
        SELECT *
        FROM quiz_option_translation
        WHERE quiz_option_id IN (
            SELECT id
            FROM reaktor.quiz_option
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_option_translation (quiz_option_id, language_id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_item_answer AS
        SELECT *
        FROM quiz_item_answer
        WHERE quiz_item_id IN (
            SELECT id
            FROM reaktor.quiz_item
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_item_answer (id)  
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_option_answer AS
        SELECT *
        FROM quiz_option_answer
        WHERE quiz_option_id IN (
            SELECT id
            FROM reaktor.quiz_option
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_option_answer (id)
    `)

    await knex.raw(`
        GRANT SELECT ON ALL TABLES IN SCHEMA reaktor TO reaktor
    `)
  }
}

export async function down(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    await knex.raw("DROP MATERIALIZED VIEW reaktor.quiz_item CASCADE")

    await knex.schema.alterTable("quiz_item", table => {
      table.dropColumn("direction")
    })

    await knex.raw("DROP TYPE quiz_item_direction_enum")

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_item AS
        SELECT *
        FROM quiz_item
        WHERE quiz_id IN (
            SELECT id
            FROM reaktor.quiz
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_item (id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_option AS
        SELECT *
        FROM quiz_option
        WHERE quiz_item_id IN (
            SELECT id
            FROM reaktor.quiz_item
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_option (id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_item_translation AS
        SELECT *
        FROM quiz_item_translation
        WHERE quiz_item_id IN (
            SELECT id
            FROM reaktor.quiz_item
        )  
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_item_translation (quiz_item_id, language_id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_option_translation AS
        SELECT *
        FROM quiz_option_translation
        WHERE quiz_option_id IN (
            SELECT id
            FROM reaktor.quiz_option
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_option_translation (quiz_option_id, language_id)
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_item_answer AS
        SELECT *
        FROM quiz_item_answer
        WHERE quiz_item_id IN (
            SELECT id
            FROM reaktor.quiz_item
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_item_answer (id)  
    `)

    await knex.raw(`
        CREATE MATERIALIZED VIEW reaktor.quiz_option_answer AS
        SELECT *
        FROM quiz_option_answer
        WHERE quiz_option_id IN (
            SELECT id
            FROM reaktor.quiz_option
        )
    `)

    await knex.raw(`
        CREATE INDEX ON reaktor.quiz_option_answer (id)
    `)

    await knex.raw(`
        GRANT SELECT ON ALL TABLES IN SCHEMA reaktor TO reaktor
    `)
  }
}
