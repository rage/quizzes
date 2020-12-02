import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_answer").insert([
      {
        id: "4541181b-e667-4970-97be-07bd360fc895",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 1234,
        language_id: "xy_YZ",
        status: "manual-review",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_item_answer").insert([
      {
        id: "9b7ae31b-30d5-4bdb-8cab-f613624a6194",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        text_data: "blaadi blaa",
      },
      {
        id: "4c5dc2d6-1e45-48c2-9136-708b05628b4d",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        text_data: "blaadi blaa. This contains a magic word: peanuts!",
      },
      {
        id: "665c8d07-fd42-49a9-9371-c26b6433b117",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        text_data: "blaadi blaa. I also contain the magic word (peanuts).",
      },
      {
        id: "627ed588-d3f3-44f9-8f70-ada521e61dc6",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        text_data: "ho ho. A completely different answer",
      },
      {
        id: "ac77104e-0679-44cd-93f9-6e1d2fc4cdd4",
        quiz_answer_id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        text_data: "lorem ipsum something something.",
      },
      {
        id: "b4640ca7-216e-4b1c-8798-1d9c617471f1",
        quiz_answer_id: "4541181b-e667-4970-97be-07bd360fc895",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
        text_data: "linked to an answer queued for manual review",
      },
    ]),
  ])
}
