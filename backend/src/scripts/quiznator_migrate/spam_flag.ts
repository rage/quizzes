import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { QuizAnswer, SpamFlag, User } from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateSpamFlags(users: { [username: string]: User }) {
  console.log("Querying spam flags...")
  const oldFlags = (await QNSpamFlag.find({})).map(
    (spamFlag: { [key: string]: any }) => spamFlag._id.split("-"),
  )

  const existingIDs = await QuizAnswer.createQueryBuilder()
    .select(["id"])
    .getRawMany()

  console.log("Converting spam flags...")
  const spamFlags = []
  for (let [username, answerID] of oldFlags) {
    const user = users[username]
    if (!user) {
      continue
    }

    answerID = getUUIDByString(answerID)
    if (!existingIDs.includes(answerID)) {
      continue
    }

    spamFlags.push({
      userId: user.id,
      quizAnswerId: answerID,
    })
  }

  console.log("Inserting spam flags...")
  const chunkSize = 32700
  for (let i = 0; i < spamFlags.length; i += chunkSize) {
    await SpamFlag.createQueryBuilder()
      .insert()
      .values(spamFlags.slice(i, i + chunkSize))
      .onConflict(`("id") DO NOTHING`)
      .execute()
  }
}
