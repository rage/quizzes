import database from "../../database"
import { Organization } from "../../models"

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

async function main() {
  await database.promise

  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/quiznator",
  )

  const org = await Organization.merge(Organization.create({ id: 0 })).save()

  const languages = await createLanguages()
  const courses = await migrateCourses(org, languages)
  const quizzes = await migrateQuizzes(courses)
  const peerReviewQuestions = await migratePeerReviewQuestions(quizzes)
  const users = await migrateUsers()
  await migrateCourseStates(courses, users)
  const answers = await migrateQuizAnswers(quizzes, users)
  await migrateSpamFlags(users, answers)
  await migratePeerReviews(users, quizzes, peerReviewQuestions, answers)
  console.log("Migration complete")
  process.exit()
}

main().catch(console.error)
