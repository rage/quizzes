import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table
      .enu(
        "multiple_selected_options_grading_options",
        ["NeedToSelectAllCorrectOptions", "NeedToSelectNCorrectOptions"],
        {
          useNative: true,
          enumName: "multiple_selected_options_grading_policy_enum",
        },
      )
      .defaultTo("NeedToSelectAllCorrectOptions")

    table.integer("multiple_selected_options_grading_policy_n").defaultTo(1)

    // TODO: NeedToSelectAllCorrectOptions basically same
    // table.dropColumn("multi")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table.dropColumn("multiple_selected_options_grading_options")
    table.dropColumn("multiple_selected_options_grading_policy_n")

    // TODO
    // table
    //   .boolean("multi")
    //   .defaultTo(false)
    //   .notNullable()
  })

  await knex.schema.raw(
    `drop type if exists multiple_selected_options_grading_policy_enum;`,
  )
}
