import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
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
    ]),
  ])
}
