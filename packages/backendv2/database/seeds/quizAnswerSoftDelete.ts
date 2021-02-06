import * as Knex from "knex"

export async function seed(knex: Knex): Promise<void> {
  await knex("language").insert([
    {
      id: "xx_XX",
      country: "country",
      name: "language",
    },
  ])
  await knex("course").insert([
    {
      id: "fd2acb31-b722-4ff0-8f05-da668001113c",
    },
  ])

  await knex("course_translation").insert([
    {
      course_id: "fd2acb31-b722-4ff0-8f05-da668001113c",
      language_id: "xx_XX",
      abbreviation: "",
      title: "",
      body: "",
    },
  ])

  await knex("quiz").insert([
    {
      id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      course_id: "fd2acb31-b722-4ff0-8f05-da668001113c",
      points: 3,
      part: 1,
    },
  ])

  await knex("quiz_translation").insert([
    {
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      language_id: "xx_XX",
      title: "",
      body: "",
    },
  ])

  await knex("quiz_item").insert([
    {
      id: "2b80b246-647c-45e9-8bfe-98cd25f7373f",
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      type: "essay",
      order: 0,
    },
  ])

  await knex("quiz_item_translation").insert([
    {
      quiz_item_id: "2b80b246-647c-45e9-8bfe-98cd25f7373f",
      language_id: "xx_XX",
      title: "",
      body: "",
      success_message: "",
      failure_message: "",
    },
  ])

  await knex("user").insert([
    {
      id: 12345,
    },
  ])

  await knex("user_quiz_state").insert([
    {
      user_id: 12345,
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      points_awarded: 3,
      tries: 3,
      status: "locked",
    },
  ])

  await knex("quiz_answer").insert([
    {
      id: "16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
      user_id: 12345,
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      language_id: "xx_XX",
      status: "submitted",
      correctness_coefficient: 1,
    },
    {
      id: "444bc441-3c97-45a0-be7a-db1516539871",
      user_id: 12345,
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      language_id: "xx_XX",
      status: "submitted",
      correctness_coefficient: 0.75,
    },
    {
      id: "08e91588-e1df-4497-8ec3-368cebeb1f79",
      user_id: 12345,
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      language_id: "xx_XX",
      status: "submitted",
      correctness_coefficient: 0.5,
    },
  ])
}
