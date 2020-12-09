import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("user").insert([
      {
        id: 1234,
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("language").insert([
      {
        id: "xy_YZ",
        country: "country",
        name: "language",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("course").insert([
      {
        id: "21356a26-7508-4705-9bab-39b239862632",
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
        course_id: "21356a26-7508-4705-9bab-39b239862632",
        language_id: "xy_YZ",
        title: "course 1",
        body: "course",
        abbreviation: "course",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz").insert([
      {
        id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        course_id: "21356a26-7508-4705-9bab-39b239862632",
        part: 1,
        section: 3,
        points: 1,
        deadline: null,
        open: null,
        excluded_from_score: false,
        auto_confirm: true,
        tries: 1,
        tries_limited: false,
        award_points_even_if_wrong: false,
        grant_points_policy: "grant_whenever_possible",
        auto_reject: false,
      },
    ]),
  ])

  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("quiz_item").insert([
      {
        id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        quiz_id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        type: "essay",
        order: 0,
        validity_regex: "{}",
        format_regex: null,
        multi: false,
        min_words: null,
        max_words: null,
        max_value: null,
        min_value: null,
        uses_shared_option_feedback_message: false,
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_answer").insert([
      {
        id: "baa83266-2194-43f4-be37-177c273c82b1",
        quiz_id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        user_id: 1234,
        status: "submitted",
        language_id: "xy_YZ",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (user_id, quiz_id) DO NOTHING", [
    knex("user_quiz_state").insert([
      {
        user_id: 1234,
        quiz_id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        peer_reviews_given: 0,
        peer_reviews_received: 0,
        points_awarded: 0,
        spam_flags: 0,
        tries: 1,
        status: "locked",
      },
    ]),
  ])

  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("peer_review_collection").insert([
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quiz_id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        deleted: false,
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("peer_review").insert([
      {
        id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
        quiz_answer_id: "baa83266-2194-43f4-be37-177c273c82b1",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        user_id: 1234,
      },
      {
        id: "3fa39c7a-d045-437c-b0cd-8dce349e95fc",
        quiz_answer_id: "baa83266-2194-43f4-be37-177c273c82b1",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        user_id: 1234,
      },
    ]),
  ])

  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("peer_review_question").insert([
      {
        id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        default: true,
        type: "grade",
        order: 1,
        deleted: false,
      },
      {
        id: "c59593ea-f6a7-4857-aa7a-1be9762522da",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        default: true,
        type: "grade",
        order: 1,
        deleted: false,
      },
      {
        id: "be725960-b262-4f01-852c-4bba77c82f85",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        default: true,
        type: "grade",
        order: 1,
        deleted: false,
      },
      {
        id: "1a4e7dea-564d-417a-85dd-f6976f51860b",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        default: true,
        type: "grade",
        order: 1,
        deleted: false,
      },
    ]),
  ])

  await knex.raw(
    "? ON CONFLICT (peer_review_id, peer_review_question_id) DO NOTHING",
    [
      knex("peer_review_question_answer").insert([
        {
          peer_review_id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
          peer_review_question_id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
          value: 2,
        },
        {
          peer_review_id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
          peer_review_question_id: "c59593ea-f6a7-4857-aa7a-1be9762522da",
          value: 2,
        },
        {
          peer_review_id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
          peer_review_question_id: "be725960-b262-4f01-852c-4bba77c82f85",
          value: 2,
          text: null,
        },
        {
          peer_review_id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
          peer_review_question_id: "1a4e7dea-564d-417a-85dd-f6976f51860b",
          value: 2,
          text: null,
        },
        {
          peer_review_id: "3fa39c7a-d045-437c-b0cd-8dce349e95fc",
          peer_review_question_id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
          value: 2,
        },
        {
          peer_review_id: "3fa39c7a-d045-437c-b0cd-8dce349e95fc",
          peer_review_question_id: "c59593ea-f6a7-4857-aa7a-1be9762522da",
          value: 2,
        },
        {
          peer_review_id: "3fa39c7a-d045-437c-b0cd-8dce349e95fc",
          peer_review_question_id: "be725960-b262-4f01-852c-4bba77c82f85",
          value: 2,
          text: null,
        },
        {
          peer_review_id: "3fa39c7a-d045-437c-b0cd-8dce349e95fc",
          peer_review_question_id: "1a4e7dea-564d-417a-85dd-f6976f51860b",
          value: 1,
          text: null,
        },
      ]),
    ],
  )
}
