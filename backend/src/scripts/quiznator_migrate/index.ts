import database from "../../database"
import { Organization } from "../../models"

import mongoUtils from "./mongo_utils"

import { migrateCourses } from "./course"
import { createLanguages } from "./language"
import { migratePeerReviewQuestions } from "./peer_review"
import { migrateQuizzes } from "./quiz"

async function main() {
  const db = await database.promise

  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/quiznator",
  )

  const org = await Organization.merge(Organization.create({ id: 0 })).save()

  const languages = await createLanguages(db)
  const courses = await migrateCourses(org, languages)
  await migrateQuizzes(db, courses)
  await migratePeerReviewQuestions(db, courses)
}

main().catch(console.error)
