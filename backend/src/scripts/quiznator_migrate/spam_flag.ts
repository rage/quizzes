import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { SpamFlag, User } from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateSpamFlags(users: { [username: string]: User }) {
  console.log("Querying spam flags...")
  const oldFlags = (await QNSpamFlag.find({})).map(
    (spamFlag: { [key: string]: any }) => spamFlag._id.split("-"),
  )

  const bar = progressBar("Migrating spam flags", oldFlags.length)
  await Promise.all(
    oldFlags.map(async ([username, answerID]: [string, string]) => {
      const user = users[username]
      if (!user) {
        return
      }

      await SpamFlag.create({
        userId: user.id,
        quizAnswerId: getUUIDByString(answerID),
      }).save()
      bar.tick()
    }),
  )
}
