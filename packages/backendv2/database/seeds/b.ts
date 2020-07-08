import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
  let ids = []
  for (let i = 0; i < 15; i++) {
    const userId = i + 1
    await knex("user").insert({ id: userId })
    ids.push(
      (
        await knex("quiz_answer")
          .insert({
            quiz_id: "2a0c2270-011e-40b2-8796-625764828034",
            user_id: userId,
            language_id: "xy_YZ",
            status: "manual-review",
          })
          .returning("id")
      )[0],
    )
  }
  let itemAnswerIds = []
  for (const id of ids) {
    itemAnswerIds.push(
      await knex("quiz_item_answer")
        .insert({
          quiz_answer_id: id,
          quiz_item_id: "742c0e08-c884-4117-b9a9-05650e1606f2",
        })
        .returning("id"),
    )
  }
  for (const itemAnswerId of itemAnswerIds.flat()) {
    await knex("quiz_option_answer").insert({
      quiz_item_answer_id: itemAnswerId,
      quiz_option_id: "2bdd0438-9c2f-4ede-81ff-a1cf55c647cd",
    })
  }
  itemAnswerIds = []
  for (const id of ids) {
    itemAnswerIds.push(
      await knex("quiz_item_answer")
        .insert({
          quiz_answer_id: id,
          quiz_item_id: "4b3a9922-6b24-43f2-82bf-9ae9a0d34285",
        })
        .returning("id"),
    )
  }
  for (const itemAnswerId of itemAnswerIds.flat()) {
    await knex("quiz_option_answer").insert({
      quiz_item_answer_id: itemAnswerId,
      quiz_option_id: "1265f35e-77d9-4e20-9fdf-407b00cbd692",
    })
  }
  ids = []
  for (let i = 0; i < 20; i++) {
    const userId = (i + 1) * 100
    await knex("user").insert({ id: userId })
    ids.push(
      (
        await knex("quiz_answer")
          .insert({
            quiz_id: "2a0c2270-011e-40b2-8796-625764828034",
            user_id: userId,
            language_id: "xy_YZ",
            status: "confirmed",
          })
          .returning("id")
      )[0],
    )
  }
  itemAnswerIds = []
  for (const id of ids) {
    itemAnswerIds.push(
      await knex("quiz_item_answer")
        .insert({
          quiz_answer_id: id,
          quiz_item_id: "742c0e08-c884-4117-b9a9-05650e1606f2",
        })
        .returning("id"),
    )
  }
  for (const itemAnswerId of itemAnswerIds.flat()) {
    await knex("quiz_option_answer").insert({
      quiz_item_answer_id: itemAnswerId,
      quiz_option_id: "2bdd0438-9c2f-4ede-81ff-a1cf55c647cd",
    })
  }
  itemAnswerIds = []
  for (const id of ids) {
    itemAnswerIds.push(
      await knex("quiz_item_answer")
        .insert({
          quiz_answer_id: id,
          quiz_item_id: "4b3a9922-6b24-43f2-82bf-9ae9a0d34285",
        })
        .returning("id"),
    )
  }
  for (const itemAnswerId of itemAnswerIds.flat()) {
    await knex("quiz_option_answer").insert({
      quiz_item_answer_id: itemAnswerId,
      quiz_option_id: "1265f35e-77d9-4e20-9fdf-407b00cbd692",
    })
  }
}
