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
        moocfi_id: "aa141326-fc86-4c8f-b7d8-b7778fc56f26",
        max_review_spam_flags: 3,
      },
      {
        id: "51b66fc3-4da2-48aa-8eab-404370250ca3",
        min_score_to_pass: null,
        min_progress_to_pass: null,
        min_peer_reviews_received: 2,
        min_peer_reviews_given: 3,
        min_review_average: 2,
        max_spam_flags: 1,
        organization_id: null,
        moocfi_id: "12059bbf-4f5b-49ff-85e2-f5bd0797c603",
        max_review_spam_flags: 3,
      },
    ]),
  ])

  await knex.raw(`? ON CONFLICT (course_id, language_id) DO NOTHING`, [
    knex("course_translation").insert([
      {
        course_id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        language_id: "xy_YZ",
        title: "course 1",
        body: "course",
        abbreviation: "course",
      },
      {
        course_id: "51b66fc3-4da2-48aa-8eab-404370250ca3",
        language_id: "xy_YZ",
        title: "course 2",
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
      {
        id: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        course_id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        part: 2,
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
      {
        id: "2a0c2270-011e-40b2-8796-625764828034",
        course_id: "51b66fc3-4da2-48aa-8eab-404370250ca3",
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
      {
        id: "b03f05d3-ec14-47f4-9352-0be6a53b4a14",
        course_id: "51b66fc3-4da2-48aa-8eab-404370250ca3",
        part: 1,
        section: 1,
        points: 1,
        deadline: new Date(),
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
        title: "quiz 1",
        body: "body",
        submit_message: "nice one!",
      },
      {
        quiz_id: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        language_id: "xy_YZ",
        title: "quiz 2",
        body: "body",
        submit_message: "nice one!",
      },
      {
        quiz_id: "2a0c2270-011e-40b2-8796-625764828034",
        language_id: "xy_YZ",
        title: "quiz 3",
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
      {
        id: "4a55eb54-6a9c-4245-843c-0577f3eafd9e",
        quiz_id: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        type: "open",
        order: 1,
        validity_regex: "koira",
        uses_shared_option_feedback_message: false,
      },
      {
        id: "8e1fe9a3-f9ca-4bba-acdb-98d5c41060d3",
        quiz_id: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        type: "open",
        order: 2,
        validity_regex: "kissa",
        uses_shared_option_feedback_message: false,
      },
      {
        id: "742c0e08-c884-4117-b9a9-05650e1606f2",
        quiz_id: "2a0c2270-011e-40b2-8796-625764828034",
        type: "multiple-choice",
        order: 1,
        uses_shared_option_feedback_message: false,
      },
      {
        id: "4b3a9922-6b24-43f2-82bf-9ae9a0d34285",
        quiz_id: "2a0c2270-011e-40b2-8796-625764828034",
        type: "multiple-choice",
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
      {
        quiz_item_id: "4a55eb54-6a9c-4245-843c-0577f3eafd9e",
        language_id: "xy_YZ",
        title: "open",
        body: "item",
        success_message: "yay!",
        failure_message: "boo!",
        shared_option_feedback_message: null,
      },
      {
        quiz_item_id: "8e1fe9a3-f9ca-4bba-acdb-98d5c41060d3",
        language_id: "xy_YZ",
        title: "open",
        body: "item",
        success_message: "yay!",
        failure_message: "boo!",
        shared_option_feedback_message: null,
      },
      {
        quiz_item_id: "742c0e08-c884-4117-b9a9-05650e1606f2",
        language_id: "xy_YZ",
        title: "multiple-choice",
        body: "item",
        success_message: "yay!",
        failure_message: "boo!",
        shared_option_feedback_message: null,
      },
      {
        quiz_item_id: "4b3a9922-6b24-43f2-82bf-9ae9a0d34285",
        language_id: "xy_YZ",
        title: "multiple-choice",
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
      {
        id: "2bdd0438-9c2f-4ede-81ff-a1cf55c647cd",
        quiz_item_id: "742c0e08-c884-4117-b9a9-05650e1606f2",
        order: 1,
        correct: false,
      },
      {
        id: "112049f2-12d2-4b9e-b3e4-6e9341dfa73f",
        quiz_item_id: "742c0e08-c884-4117-b9a9-05650e1606f2",
        order: 2,
        correct: false,
      },
      {
        id: "1265f35e-77d9-4e20-9fdf-407b00cbd692",
        quiz_item_id: "4b3a9922-6b24-43f2-82bf-9ae9a0d34285",
        order: 1,
        correct: false,
      },
      {
        id: "81778d6e-5a38-4f68-befe-4567e1f38c88",
        quiz_item_id: "4b3a9922-6b24-43f2-82bf-9ae9a0d34285",
        order: 2,
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
      {
        quiz_option_id: "2bdd0438-9c2f-4ede-81ff-a1cf55c647cd",
        language_id: "xy_YZ",
        title: "Joo",
        success_message: "true",
        failure_message: "false",
      },
      {
        quiz_option_id: "112049f2-12d2-4b9e-b3e4-6e9341dfa73f",
        language_id: "xy_YZ",
        title: "Ei",
        success_message: "true",
        failure_message: "false",
      },
      {
        quiz_option_id: "1265f35e-77d9-4e20-9fdf-407b00cbd692",
        language_id: "xy_YZ",
        title: "Joo",
        success_message: "true",
        failure_message: "false",
      },
      {
        quiz_option_id: "81778d6e-5a38-4f68-befe-4567e1f38c88",
        language_id: "xy_YZ",
        title: "Ei",
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
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("user").insert([
      {
        id: 1234,
      },
      {
        id: 4321,
      },
      {
        id: 2345,
      },
      {
        id: 3456,
      },
      {
        id: 4567,
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("user_course_role").insert([
      {
        user_id: 1234,
        course_id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        role: "teacher",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_answer").insert([
      {
        id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 1234,
        language_id: "xy_YZ",
        status: "given-enough",
      },
      {
        id: "ae29c3be-b5b6-4901-8588-5b0e88774748",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 2345,
        language_id: "xy_YZ",
        status: "given-enough",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_item_answer").insert([
      {
        id: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
      },
      {
        id: "31941489-29a1-448d-bc59-418480d007d9",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_option_answer").insert([
      {
        id: "ab6c2932-193c-439c-a5b5-1694bebdc178",
        quiz_item_answer_id: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
        quiz_option_id: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (user_id, quiz_id) DO NOTHING", [
    knex("user_quiz_state").insert([
      {
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 1234,
        status: "locked",
      },
      {
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 2345,
        status: "locked",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("peer_review").insert([
      {
        id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        user_id: 2345,
      },
      {
        id: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        user_id: 3456,
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
          value: 1,
        },
        {
          peer_review_id: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
          peer_review_question_id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
          value: 2,
        },
      ]),
    ],
  )

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("spam_flag").insert([
      {
        id: "ba78b819-fca0-4c59-b2ad-1b36f173a657",
        user_id: 1234,
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
      },
    ]),
  ])
}
