import knex from "../config/knex"
;(async () => {
  try {
    console.time()
    console.log(new Date(), "refreshing reaktor_view")
    await knex.raw(`refresh materialized view reaktor_view`)
    console.timeEnd("done in")
  } catch (error) {
    console.log(error)
  }
  process.exit()
})()
