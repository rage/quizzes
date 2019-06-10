import axios from "axios"

import { Organization } from "./models"
import { Database } from "./config/database"

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

import { logger } from "./config/winston"

import dotenv from "dotenv"

import * as appRoot from "app-root-path"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `${appRoot.path}/.env` })
}

async function main() {
  logger.info("Connecting to Postgres")
  const database = Container.get(Database)
  const connection = await database.connect()
  const manager = connection.createEntityManager()

  const migrations = await manager.query(
    "select date from migration order by date desc limit 1",
  )

  const now: any = new Date()

  const latest = migrations[0].date.toISOString()

  logger.info(`Fetching from quiznator: data added since ${latest}`)
  const response = await axios.get(
    `http://quiznator.mooc.fi/api/v1/migration/${encodeURIComponent(latest)}`,
    // `http://127.0.0.1:3000/api/v1/migration/${encodeURIComponent(latest)}`,
    { headers: { authorization: `Bearer ${process.env.TMC_TOKEN}` } },
  )

  const data = response.data

  logger.info("Data to be upserted:")
  Object.keys(data).forEach(key => {
    logger.info(`${key}: ${data[key].length}`)
  })

  /*logger.info"Connecting to MongoDB")
  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/test", // quiznator
  )*/

  logger.info("Migration started")
  console.time("Database migration complete. Time used")
  const timer = logger.startTimer()
  const org = await Organization.merge(Organization.create({ id: 0 })).save()

  const languages = await createLanguages()
  const courses = await migrateCourses(org, languages)
  const quizzes = await migrateQuizzes(courses, data.quizzes)
  await migratePeerReviewQuestions(data.peerReviewQuizzes, data.peerReviews)
  const users = await migrateUsers(data.usernames)
  // await migrateCourseStates(courses, users)
  const existingAnswers = await migrateQuizAnswers(
    quizzes,
    users,
    data.quizAnswers,
  )
  await migrateSpamFlags(users, data.spamFlags)
  await migratePeerReviews(users, existingAnswers, data.peerReviews)
  timer.done({ message: "Migration complete" })
  console.timeEnd("Database migration complete. Time used")

  await manager.query(
    `insert into migration (date) values ('${new Date(
      now - 10 * 60000,
    ).toISOString()}')`,
  )

  process.exit()
}

main().catch(console.error)
