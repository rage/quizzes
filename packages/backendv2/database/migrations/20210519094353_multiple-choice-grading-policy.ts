import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table
      .enu(
        "multiple_choice_grading_policy",
        ["NeedToSelectAllCorrectOptions", "NeedToSelectNCorrectOptions"],
        {
          useNative: true,
          enumName: "multiple_selected_options_grading_policy_enum",
        },
      )
      .defaultTo("NeedToSelectAllCorrectOptions")

    table.integer("multiple_selected_options_grading_policy_n").defaultTo(0)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table.dropColumn("multiple_choice_grading_policy")
    table.dropColumn("multiple_selected_options_grading_policy_n")
  })
}
