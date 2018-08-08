import axios from "axios"

import { User } from "../../models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { progressBar } from "./util"

const TMC_TOKEN =
  "7ae010e2e5641e6bdf9f05cd60b037ad6027be9189ad9b9420edee3468e7f27e"

export async function migrateUsers(): Promise<{ [username: string]: User }> {
  console.log("Querying list of usernames...")
  const usernames = await QNQuizAnswer.distinct("answererId")

  console.log(`Fetching user list with ${usernames.length} usernames...`)
  const resp = await axios.post(
    "https://tmc.mooc.fi/api/v8/users/basic_info_by_usernames",
    {
      usernames,
    },
    {
      headers: {
        Authorization: `Bearer ${TMC_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  )
  const bar = progressBar("Creating users", resp.data.length)
  const users: { [username: string]: User } = {}
  for (const info of resp.data) {
    const user = User.create({
      id: info.id,
    })
    await user.save()
    users[info.username] = user
    bar.tick()
  }
  return users
}
