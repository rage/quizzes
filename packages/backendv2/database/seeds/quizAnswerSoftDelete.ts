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
      // Student
      id: 12345,
    },
    {
      // Teacher
      id: 23456,
    },
    {
      // Assistant
      id: 34567,
    },
    {
      // Reviewer
      id: 45678,
    },
    { id: 123456789 },
    { id: 234567891 },
    { id: 345678912 },
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
    {
      id: "38140980-0bcb-4fec-b5a0-43c46312817b",
      user_id: 12345,
      quiz_id: "f98cd4b0-41b1-4a15-89a2-4c991ec67264",
      language_id: "xx_XX",
      status: "submitted",
      correctness_coefficient: 1,
      deleted: true,
    },
  ])

  await knex("user_course_role").insert([
    {
      id: "77b8a32f-f195-4001-b66e-8a4f00ac72d5",
      user_id: 23456,
      course_id: "fd2acb31-b722-4ff0-8f05-da668001113c",
      role: "teacher",
    },
    {
      id: "14662e14-bc8c-48ad-967f-a4ae2a0413d4",
      user_id: 34567,
      course_id: "fd2acb31-b722-4ff0-8f05-da668001113c",
      role: "assistant",
    },
    {
      id: "a4a9aafc-4aa5-4fe9-96a8-220b4e1108c2",
      user_id: 45678,
      course_id: "fd2acb31-b722-4ff0-8f05-da668001113c",
      role: "reviewer",
    },
  ])

  await knex("spam_flag").insert([
    {
      id: "632286dc-d1a4-41b9-8f4e-d50ee56b78d3",
      user_id: 123456789,
      quiz_answer_id: "444bc441-3c97-45a0-be7a-db1516539871",
    },
    {
      id: "67ec2d3c-e1ff-4630-b4c3-63966823865b",
      user_id: 234567891,
      quiz_answer_id: "08e91588-e1df-4497-8ec3-368cebeb1f79",
    },
    {
      id: "1ed2919d-e1d4-4c9b-96c5-69299ce5fe70",
      user_id: 345678912,
      quiz_answer_id: "08e91588-e1df-4497-8ec3-368cebeb1f79",
    },
  ])
}
