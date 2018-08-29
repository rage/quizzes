import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { QuizAnswer, SpamFlag, User } from "../../models"
import { getUUIDByString, insert } from "./util"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

export async function migrateSpamFlags(users: { [username: string]: User }) {
  console.log("Querying spam flags...")
  const oldFlags = (await QNSpamFlag.find({})).map(
    (spamFlag: { [key: string]: any }) => spamFlag._id.split("-"),
  )

  const existingIDs = (await QuizAnswer.createQueryBuilder()
    .select(["id"])
    .getRawMany()).map((idObject: { id: string }) => idObject.id)

  console.log("Converting spam flags...")
  const spamFlags: Array<QueryPartialEntity<SpamFlag>> = []
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
    await insert(
      SpamFlag,
      spamFlags.slice(i, i + chunkSize),
      `"user_id", "quiz_answer_id"`,
    )
  }
}
