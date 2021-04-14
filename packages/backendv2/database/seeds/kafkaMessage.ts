import * as Knex from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex("kafka_message").insert([
    {
      id: "d08eba4f-fd16-425f-b962-b33749321e52",
      topic: "user-points-realtime",
      message: "test",
    },
    {
      id: "623c9564-6c86-464a-908f-47655dde61ba",
      topic: "user-points-realtime",
      message: "test",
    },
    {
      id: "a1478484-02b0-42c5-869f-c8d6e6e49738",
      topic: "user-points-realtime",
      message: "test",
    },
    {
      id: "8b3c9b0b-5307-40ae-b6b8-cd7378df98e3",
      topic: "something-else",
      message: "test",
    },
  ])
}
