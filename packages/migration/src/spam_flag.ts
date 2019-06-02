import { QuizAnswer, SpamFlag, User } from "./models"
import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { calculateChunkSize, progressBar } from "./util"
import { getUUIDByString, insert } from "./util/"
import { LAST_MIGRATION } from "./"

const flags = [
  {
    "_id": "$Reveles-582842a460cdb10004255fac",
    "__v": 0
  },
  {
    "_id": "011044327-5c9457af99236814c5bc1033",
    "__v": 0
  },
  {
    "_id": "011044327-5c94a7d7c41ed4148d973876",
    "__v": 0
  },
  {
    "_id": "011044327-5c97b1233972a9147410b9c2",
    "__v": 0
  },
  {
    "_id": "011048682-59bd019e6ee1930004e5f923",
    "__v": 0
  },
  {
    "_id": "012351572-5a2fd5f2174aca00041612fd",
    "__v": 0
  },
  {
    "_id": "012351572-5b0d29823f52d86e87e51a50",
    "__v": 0
  },
  {
    "_id": "012368471-589729e44aab260004a55293",
    "__v": 0
  },
  {
    "_id": "012368471-58b06a948acc4500044c2493",
    "__v": 0
  },
  {
    "_id": "012368471-58b2a473aa7b040004ec686e",
    "__v": 0
  }
]


export async function migrateSpamFlags(users: { [username: string]: User }) {
  console.log("Querying spam flags...")
  const oldFlags = (await QNSpamFlag.find({}))
  // const oldFlags = flags
    .map(
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
