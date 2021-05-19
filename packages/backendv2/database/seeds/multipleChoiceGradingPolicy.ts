import * as Knex from "knex"

export async function seed(knex: Knex): Promise<void> {
  await knex("language").insert([
    {
      id: "xy_YZ",
      country: "country",
      name: "language",
    },
  ])

  await knex("course").insert([
    {
      id: "cd02cb32-d8d9-407f-b95f-4357864bee7a",
      min_score_to_pass: null,
      min_progress_to_pass: null,
      min_peer_reviews_received: 2,
      min_peer_reviews_given: 3,
      min_review_average: 2,
      max_spam_flags: 1,
      organization_id: null,
      moocfi_id: "f3e59b24-ff79-4f67-a9aa-21c94977240a",
      max_review_spam_flags: 3,
    },
  ])

  await knex("course_translation").insert([
    {
      course_id: "cd02cb32-d8d9-407f-b95f-4357864bee7a",
      language_id: "xy_YZ",
      title: "course 1",
      body: "course",
      abbreviation: "course",
    },
  ])

  await knex("quiz").insert([
    {
      id: "d7389c86-7a3a-4593-b810-b2be35319520",
      course_id: "cd02cb32-d8d9-407f-b95f-4357864bee7a",
      part: 1,
      section: 1,
      points: 1,
      deadline: null,
      open: null,
      excluded_from_score: false,
      auto_confirm: true,
      tries: 1,
      tries_limited: true,
      award_points_even_if_wrong: false,
      grant_points_policy: "grant_whenever_possible",
      auto_reject: true,
    },
  ])

  await knex("quiz_translation").insert([
    {
      quiz_id: "d7389c86-7a3a-4593-b810-b2be35319520",
      language_id: "xy_YZ",
      title: "quiz 1",
      body: "body",
      submit_message: "nice one!",
    },
  ])

  await knex("quiz_item").insert([
    {
      id: "40f7a704-fbbe-4411-8176-31449a5968fe",
      quiz_id: "d7389c86-7a3a-4593-b810-b2be35319520",
      type: "multiple-choice",
      order: 1,
      uses_shared_option_feedback_message: false,
      multiple_choice_grading_policy: "NeedToSelectAllCorrectOptions",
      multi: true,
    },
    {
      id: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      quiz_id: "d7389c86-7a3a-4593-b810-b2be35319520",
      type: "multiple-choice",
      order: 2,
      uses_shared_option_feedback_message: false,
      multiple_choice_grading_policy: "NeedToSelectNCorrectOptions",
      multiple_selected_options_grading_policy_n: 2,
      multi: true,
    },
  ])

  await knex("quiz_item_translation").insert([
    {
      quiz_item_id: "40f7a704-fbbe-4411-8176-31449a5968fe",
      language_id: "xy_YZ",
      title: "multiple-choice",
      body: "item",
      success_message: "yay!",
      failure_message: "boo!",
      shared_option_feedback_message: null,
    },
  ])

  await knex("quiz_option").insert([
    {
      id: "6b906647-7956-44b5-ac0f-77157c6c8a74",
      quiz_item_id: "40f7a704-fbbe-4411-8176-31449a5968fe",
      order: 1,
      correct: false,
    },
    {
      id: "12a56d49-1f21-46ba-bcf7-5e90da61ecd1",
      quiz_item_id: "40f7a704-fbbe-4411-8176-31449a5968fe",
      order: 2,
      correct: false,
    },
    {
      id: "08e648dd-176c-4ba9-a1e8-44231aef221f",
      quiz_item_id: "40f7a704-fbbe-4411-8176-31449a5968fe",
      order: 3,
      correct: true,
    },
    {
      id: "53c77121-daf7-485e-805d-78550b6e435d",
      quiz_item_id: "40f7a704-fbbe-4411-8176-31449a5968fe",
      order: 4,
      correct: true,
    },
    {
      id: "0862ddd4-e9d2-485b-b605-03cdfc94bcc4",
      quiz_item_id: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      order: 1,
      correct: false,
    },
    {
      id: "853e536a-a374-4e80-ba81-23c75f475529",
      quiz_item_id: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      order: 2,
      correct: false,
    },
    {
      id: "43142a08-2fd6-4356-b5cc-1a4b2d9ea085",
      quiz_item_id: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      order: 3,
      correct: true,
    },
    {
      id: "2f5ad9fd-59c2-4909-bf85-42931149e47c",
      quiz_item_id: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      order: 4,
      correct: true,
    },
  ])

  await knex("user").insert([{ id: 1234 }])
}
