import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table
      .enu(
        "feedback_display_policy",
        ["DisplayFeedbackOnQuizItem", "DisplayFeedbackOnAllOptions"],
        {
          useNative: true,
          enumName: "quiz_item_feedback_display_policy",
        },
      )
      .defaultTo("DisplayFeedbackOnQuizItem")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("quiz_item", table => {
    table.dropColumn("feedback_display_policy")
  })
}
