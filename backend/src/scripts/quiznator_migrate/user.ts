import fs from "fs"

import axios from "axios"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { User } from "../../models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"

const TMC_TOKEN =
  "7ae010e2e5641e6bdf9f05cd60b037ad6027be9189ad9b9420edee3468e7f27e"

export async function migrateUsers(): Promise<{ [username: string]: User }> {
  console.log("Querying list of usernames...")
  const usernames = await QNQuizAnswer.distinct("answererId")

  const userInfo = await getUserInfo(usernames)

  console.log("Converting users...")
  const dbInput = userInfo.map(
    (info: any): QueryPartialEntity<User> => ({
      id: info.id,
    }),
  )
  console.log("Inserting users...")
  const chunkSize = 65500
  for (let i = 0; i < dbInput.length; i += chunkSize) {
    await User.createQueryBuilder()
      .insert()
      .values(dbInput.slice(i, i + chunkSize))
      .onConflict(`("id") DO NOTHING`)
      .execute()
  }

  const users: { [username: string]: User } = {}
  console.log("Querying inserted users...")
  const existingUsers = await User.find({})
  if (existingUsers.length > 0) {
    const existingUsersByID: { [id: number]: User } = {}
    for (const user of existingUsers) {
      existingUsersByID[user.id] = user
    }
    for (const info of userInfo) {
      users[info.username] = existingUsersByID[info.id]
    }
    return users
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
