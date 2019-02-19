import { QuizAnswer, SpamFlag, User } from "@quizzes/common/models"
import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { calculateChunkSize, progressBar } from "./util"
import { getUUIDByString, insert } from "@quizzes/common/util"

export async function migrateSpamFlags(users: { [username: string]: User }) {
  console.log("Querying spam flags...")
  const oldFlags = (await QNSpamFlag.find({})).map(
    (spamFlag: { [key: string]: any }) => {
      const split = spamFlag._id.split("-")
      return [split.slice(0, -1).join("-"), split.slice(-1)[0]]
    },
  )

  const existingIDs = (await QuizAnswer.createQueryBuilder()
    .select(["id"])
    .getRawMany()).map((idObject: { id: string }) => idObject.id)

  let bar = progressBar("Converting spam flags", oldFlags.length)
  const spamFlags: Array<QueryPartialEntity<SpamFlag>> = []
  for (let [username, answerID, createdAt, updatedAt] of oldFlags) {
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
      createdAt,
      updatedAt,
    })
    bar.tick()
  }

  bar = progressBar("Inserting spam flags", spamFlags.length)
  const chunkSize = calculateChunkSize(spamFlags[0])
  for (let i = 0; i < spamFlags.length; i += chunkSize) {
    const vals = spamFlags.slice(i, i + chunkSize)
    await insert(SpamFlag, vals, `"user_id", "quiz_answer_id"`)
    bar.tick(vals.length)
  }
}
