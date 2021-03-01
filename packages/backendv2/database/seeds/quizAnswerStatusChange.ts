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
      {
        id: "1f5fd7e2-1d70-414c-8ef8-49a1de7ccbbf",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 9876,
        language_id: "xy_YZ",
        status: "given-enough",
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (user_id, quiz_id) DO NOTHING", [
    knex("user_quiz_state").insert([
      {
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        user_id: 9876,
        status: "locked",
        tries: 1,
      },
    ]),
  ])

  await knex.raw("? ON CONFLICT (id) DO NOTHING", [
    knex("quiz_item_answer").insert([
      {
        id: "f077d160-3ce5-4e14-908e-a97dba990001",
        quiz_answer_id: "1f5fd7e2-1d70-414c-8ef8-49a1de7ccbbf",
        quiz_item_id: "707195a3-aafe-4c06-bf23-854e54e084db",
      },
    ]),
  ])
}
