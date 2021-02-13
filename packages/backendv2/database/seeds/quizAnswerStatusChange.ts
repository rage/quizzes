import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_answer").insert([
      {
        id: "c786fd7f-99ab-497b-90e1-d1dfd93edfed",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 4321,
        language_id: "xy_YZ",
        status: "given-enough",
      },
      {
        id: "020d501f-046d-444b-94bd-c8fd28f81f83",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 3456,
        language_id: "xy_YZ",
        status: "given-enough",
      },
    ]),
  ])
}
