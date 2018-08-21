import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"

import { QuizAnswer, SpamFlag, User } from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migrateSpamFlags(
  users: { [username: string]: User },
  answers: { [answerID: string]: QuizAnswer },
): Promise<SpamFlag[]> {
  console.log("Querying spam flags...")
  const oldFlags = (await QNSpamFlag.find({})).map(
    (spamFlag: { [key: string]: any }) => spamFlag._id.split("-"),
  )

  const bar = progressBar("Migrating spam flags", oldFlags.length)
  // @ts-ignore
  return await Promise.all(
    oldFlags.map(
      async ([username, answerID]: [string, string]): Promise<SpamFlag> => {
        const user = users[username]
        if (!user) {
          bar.tick()
          return
        }

        const quizAnswer = answers[getUUIDByString(answerID)]
        if (!quizAnswer) {
          bar.tick()
          return
        }

        const flag = await SpamFlag.create({
          user,
          quizAnswer,
        }).save()
        bar.tick()
        return flag
      },
    ),
  )
}
