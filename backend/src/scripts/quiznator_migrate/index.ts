import database from "../../database"
import { Quiz } from "./app-modules/models"
import mongoUtils from "./mongo_utils"

async function main() {
  const db = await database.promise

  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/quiznator",
  )
  const quizzes = await Quiz.find({})
  const tags = new Set()
  for (const quiz of quizzes) {
    for (const tag of quiz.tags) {
      tags.add(tag)
    }
  }
  console.log(tags)
}

main().catch(console.error)
