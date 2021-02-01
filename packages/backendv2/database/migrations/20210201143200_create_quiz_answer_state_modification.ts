import * as Knex from "knex"

const createOperationEnum = `CREATE TYPE IF NOT EXISTS quiz_answer_state_modification_operations_enum AS ENUM ('teacher-accept', 'teacher-reject', 'teacher-suspects-plagiarism', 'peer-review-accept', 'peer-review-reject', 'peer-review-spam' )`

const dropOperationEnum = `DROP TYPE quiz_answer_state_modification_operations_enum`

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(createOperationEnum)

  if (!(await knex.schema.hasTable("quiz_answer_state_modification"))) {
    await knex.schema.createTable("quiz_answer_state_modification", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_answer_id")
        .references("id")
        .inTable("quiz_answer")
        .notNullable()
        .onDelete("CASCADE")
      table
        .integer("modifier_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .enu(
          "operation",
          [
            "teacher-accept",
            "teacher-reject",
            "teacher-suspects-plagiarism",
            "peer-review-accept",
            "peer-review-reject",
            "peer-review-spam",
          ],
          {
            useNative: true,
            enumName: "quiz_answer_state_modification_operations_enum",
          },
        )
        .notNullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(dropOperationEnum)
  return knex.schema.dropTable("quiz_answer_state_modification")
}
