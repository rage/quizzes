import fs from "fs"

import axios from "axios"

import { User } from "../../models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { progressBar } from "./util"

const TMC_TOKEN =
  "7ae010e2e5641e6bdf9f05cd60b037ad6027be9189ad9b9420edee3468e7f27e"

export async function migrateUsers(): Promise<{ [username: string]: User }> {
  console.log("Querying list of usernames...")
  const usernames = await QNQuizAnswer.distinct("answererId")

  const userInfo = await getUserInfo(usernames)

  let bar
  const users: { [username: string]: User } = {}
  const existingUsers = await User.find({})
  if (existingUsers.length > 0) {
    console.log("Existing users found in database, skipping migration")
    const existingUsersByID: { [id: number]: User } = {}
    for (const user of existingUsers) {
      existingUsersByID[user.id] = user
    }
    for (const info of userInfo) {
      users[info.username] = existingUsersByID[info.id]
    }
    return users
  }

  bar = progressBar("Creating users", userInfo.length)
  for (const info of userInfo) {
    users[info.username] = await User.create({
      id: info.id,
    }).save()
    bar.tick()
  }
  return users
}

const userInfoCachePath = "userinfo.json"

async function getUserInfo(
  usernames: string[],
): Promise<Array<{ [key: string]: any }>> {
  if (fs.existsSync(userInfoCachePath)) {
    console.log("Reading user info list cache")
    const data = JSON.parse(fs.readFileSync(userInfoCachePath).toString())
    if (data.inputUsernameCount === usernames.length) {
      console.log("Cache hit, skipping user info list fetch")
      return data.info
    }
  }

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

  fs.writeFileSync(
    userInfoCachePath,
    JSON.stringify({
      inputUsernameCount: usernames.length,
      info: resp.data,
    }),
  )

  return resp.data
}
