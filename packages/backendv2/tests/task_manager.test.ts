import app from "../app"
import knex from "../database/knex"
import { safeClean, safeSeed, configA } from "./util"
import TaskManager from "../bin/task_manager"

beforeAll(async () => {
  await safeSeed({
    directory: "./database/seeds",
  })
})

afterAll(async () => {
  await safeClean()
  knex.destroy()
})

test("rundown", async done => {})
