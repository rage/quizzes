import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("language").insert([
      {
        id: "xy_YZ",
        country: "country",
        name: "language",
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("course").insert([
      {
        id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        min_score_to_pass: null,
        min_progress_to_pass: null,
        min_peer_reviews_received: 2,
        min_peer_reviews_given: 3,
        min_review_average: 2,
        max_spam_flags: 1,
        organization_id: null,
        moocfi_id: "55dff8af-c06c-4a97-88e6-af7c04d252ca",
        max_review_spam_flags: 3,
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (course_id, language_id) DO NOTHING`, [
    knex("course_translation").insert([
      {
        course_id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        language_id: "xy_YZ",
        title: "course",
        body: "course",
        abbreviation: "course",
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("quiz").insert([
      {
        id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        course_id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
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
    ]),
  ])
  await knex.raw(`? ON CONFLICT (quiz_id, language_id) DO NOTHING`, [
    knex("quiz_translation").insert([
      {
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        language_id: "xy_YZ",
        title: "quiz",
        body: "body",
        submit_message: "nice one!",
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("quiz_item").insert([
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "multiple-choice",
        order: 1,
        uses_shared_option_feedback_message: false,
      },
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        uses_shared_option_feedback_message: false,
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (quiz_item_id, language_id) DO NOTHING`, [
    knex("quiz_item_translation").insert([
      {
        quiz_item_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        language_id: "xy_YZ",
        title: "multiple-choice",
        body: "item",
        success_message: "yay!",
        failure_message: "boo!",
        shared_option_feedback_message: null,
      },
      {
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        language_id: "xy_YZ",
        title: "essay",
        body: "item",
        success_message: "yay!",
        failure_message: "boo!",
        shared_option_feedback_message: null,
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("quiz_option").insert([
      {
        id: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
        quiz_item_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        order: 1,
        correct: false,
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (quiz_option_id, language_id) DO NOTHING`, [
    knex("quiz_option_translation").insert([
      {
        quiz_option_id: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
        language_id: "xy_YZ",
        title: "A",
        success_message: "true",
        failure_message: "false",
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("peer_review_collection").insert([
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
      },
    ]),
  ])
  await knex.raw(
    `? ON CONFLICT (peer_review_collection_id, language_id) DO NOTHING`,
    [
      knex("peer_review_collection_translation").insert([
        {
          peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
          language_id: "xy_YZ",
          title: "pr",
          body: "do this",
        },
      ]),
    ],
  )
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("peer_review_question").insert([
      {
        id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        default: true,
        type: "grade",
        order: 1,
      },
    ]),
  ])
  await knex.raw(
    `? ON CONFLICT (peer_review_question_id, language_id) DO NOTHING`,
    [
      knex("peer_review_question_translation").insert([
        {
          peer_review_question_id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
          language_id: "xy_YZ",
          title: "question",
          body: "answer this",
        },
      ]),
    ],
  )
}
