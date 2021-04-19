import * as Knex from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  for (let i = 0; i < 1001; i++) {
    await knex("kafka_message").insert([
      { topic: "user-points-realtime", message: "data" },
    ])
  }
}
