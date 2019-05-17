import { Organization } from "@quizzes/common/models"
import { Database } from "@quizzes/common/config/database"

import { Container } from "typedi"

import mongoUtils from "./mongo_utils"

import { migrateCourses } from "./course"
import { migrateCourseStates } from "./course_state"
import { createLanguages } from "./language"
import { migratePeerReviews } from "./peer_review"
import { migratePeerReviewQuestions } from "./peer_review_quiz"
import { migrateQuizzes } from "./quiz"
import { migrateQuizAnswers } from "./quiz_answer"
import { migrateSpamFlags } from "./spam_flag"
import { migrateUsers } from "./user"

export const LAST_MIGRATION = new Date(
  "2019-03-10T20:52:42+02:00",
).toISOString()

async function main() {
  console.log("Connecting to Postgres")
  const database = Container.get(Database)
  const connection = await database.connect()
  console.log("Connecting to MongoDB")
  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/test", // quiznator
  )

  console.log("Migration started")
  console.time("Database migration complete. Time used")
  const org = await Organization.merge(Organization.create({ id: 0 })).save()

  const languages = await createLanguages()
  const courses = await migrateCourses(org, languages)
  const quizzes = await migrateQuizzes(courses)
  /*await migratePeerReviewQuestions()
  const users = await migrateUsers()
  await migrateCourseStates(courses, users)
  const existingAnswers = await migrateQuizAnswers(quizzes, users)
  await migrateSpamFlags(users)
  await migratePeerReviews(users, existingAnswers)
  console.timeEnd("Database migration complete. Time used")*/
  process.exit()
}

main().catch(console.error)
