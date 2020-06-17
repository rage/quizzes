import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("course").insert([
      {
        id: "21356a26-7508-4705-9bab-39b239862632",
        min_score_to_pass: null,
        min_progress_to_pass: null,
        min_peer_reviews_received: 2,
        min_peer_reviews_given: 3,
        min_review_average: 2,
        max_spam_flags: 1,
        created_at: "2019-03-10 21:19:54.081043",
        updated_at: "2019-03-10 21:19:54.081043",
        organization_id: null,
        moocfi_id: "55dff8af-c06c-4a97-88e6-af7c04d252ca",
        max_review_spam_flags: 3,
      },
    ]),
  ])
  await knex.raw(`? ON CONFLICT (id) DO NOTHING`, [
    knex("quiz").insert([
      {
        id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        course_id: "21356a26-7508-4705-9bab-39b239862632",
        part: 1,
        section: 1,
        points: 1,
        deadline: null,
        open: null,
        excluded_from_score: false,
        created_at: "2018-05-04 10:57:33.447000",
        updated_at: "2020-03-09 14:57:00.477000",
        auto_confirm: true,
        tries: 1,
        tries_limited: true,
        award_points_even_if_wrong: false,
        grant_points_policy: "grant_whenever_possible",
        auto_reject: true,
      },
    ]),
  ])
}
