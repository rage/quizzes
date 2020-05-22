import { QuizAnswer, SpamFlag, User } from "./models"
import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { calculateChunkSize, progressBar } from "./util"
import { getUUIDByString, insert } from "./util/"

import { logger } from "./config/winston"

export async function migrateSpamFlags(
  users: { [username: string]: User },
  flags: any[],
) {
  logger.info("Querying spam flags...")

  const currentFlagIds: { [id: string]: boolean } = {}
  ;(await SpamFlag.createQueryBuilder()
    .select(["id"])
    .getRawMany()).forEach(
    (idObject: { id: string }) => (currentFlagIds[idObject.id] = true),
  )

  logger.info(
    `${Object.keys(currentFlagIds).length} existing spam flags in the database`,
  )

  const oldFlags = flags.map((spamFlag: { [key: string]: any }) => {
    const split = spamFlag._id.split("-")
    return [split.slice(0, -1).join("-"), split.slice(-1)[0]]
  })

  const existingIDs = (await QuizAnswer.query(
    "select id from quiz_answer",
  )).map((qa: any) => qa.id)

  let bar = progressBar("Converting spam flags", oldFlags.length)
  const spamFlags: Array<QueryPartialEntity<SpamFlag>> = []
  for (let [username, answerID, createdAt, updatedAt] of oldFlags) {
    const id = getUUIDByString(username + answerID)

    if (currentFlagIds[id]) {
      continue
    }

    const user = users[username]

    answerID = getUUIDByString(answerID)

    if (!existingIDs.includes(answerID)) {
      continue
    }

    spamFlags.push({
      id,
      userId: user ? user.id : null,
      quizAnswerId: answerID,
      createdAt,
      updatedAt,
    })
    bar.tick()
  }

  logger.info(`Inserting ${spamFlags.length} spam flags...`)
  bar = progressBar("Inserting spam flags", spamFlags.length)
  const chunkSize = calculateChunkSize(spamFlags[0])
  for (let i = 0; i < spamFlags.length; i += chunkSize) {
    const vals = spamFlags.slice(i, i + chunkSize)
    await insert(SpamFlag, vals)
    bar.tick(vals.length)
  }
}
