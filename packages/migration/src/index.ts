import axios from "axios"

import { Organization, Quiz, QuizItem, QuizOption, User } from "./models"
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

import { getUUIDByString, insert } from "./util/"

import { PeerReview as QNPeerReview } from "./app-modules/models"
import { QuizAnswer as QNQuizAnswer } from "./app-modules/models"
import { QuizAnswerSpamFlag as QNSpamFlag } from "./app-modules/models"
import { Quiz as QNQuiz } from "./app-modules/models"

import oldQuizTypes from "./app-modules/constants/quiz-types"

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

  let data: { [key: string]: any[] }

  if (process.argv.includes("local_db")) {
    logger.info(`Fetching from local database: data added since ${latest}`)
    logger.info("Connecting to MongoDB")
    await mongoUtils.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/test", // quiznator
    )

    data = {
      quizzes: await QNQuiz.find({
        type: {
          $in: [
            oldQuizTypes.ESSAY,
            oldQuizTypes.OPEN,
            oldQuizTypes.SCALE,
            oldQuizTypes.CHECKBOX,
            oldQuizTypes.MULTIPLE_OPEN,
            oldQuizTypes.MULTIPLE_CHOICE,
            oldQuizTypes.RADIO_MATRIX,
            oldQuizTypes.PRIVACY_AGREEMENT,
          ],
        },
        $or: [{ createdAt: { $gte: latest } }, { updatedAt: { $gte: latest } }],
      }),
      peerReviewQuizzes: await QNQuiz.find({
        type: { $in: [oldQuizTypes.PEER_REVIEW] },
        $or: [{ createdAt: { $gte: latest } }, { updatedAt: { $gte: latest } }],
      }),
      peerReviews: await QNPeerReview.find({
        $or: [{ createdAt: { $gte: latest } }, { updatedAt: { $gte: latest } }],
      }),
      usernames: await QNQuizAnswer.distinct("answererId"),
      quizAnswers: await QNQuizAnswer.find({
        $or: [{ createdAt: { $gte: latest } }, { updatedAt: { $gte: latest } }],
      }),
      spamFlags: await QNSpamFlag.find({}),
    }
  } else {
    const local = process.argv.includes("local_server")
    logger.info(
      `Fetching from ${
        local ? "local" : ""
      } quiznator: data added since ${latest}`,
    )
    const baseUrl = local ? "http://127.0.0.1:3000" : "http://quiznator.mooc.fi"
    const response = await axios.get(
      `${baseUrl}/api/v1/migration/${encodeURIComponent(latest)}`,
      { headers: { authorization: `Bearer ${process.env.TMC_TOKEN}` } },
    )
    data = response.data
  }

  logger.info("Data to be upserted:")
  Object.keys(data).forEach(key => {
    logger.info(`${key}: ${data[key].length}`)
  })

  console.log("Migration started")
  console.time("Database migration complete. Time used")
  const timer = logger.startTimer()
  const org = await Organization.merge(Organization.create({ id: 0 })).save()

  const languages = await createLanguages()
  const courses = await migrateCourses(org, languages)
  const quizzes = await migrateQuizzes(courses, data.quizzes)
  await migratePeerReviewQuestions(
    data.peerReviewQuizzes,
    data.peerReviews,
    quizzes,
  )
  const users = await migrateUsers(data.usernames)
  // await migrateCourseStates(courses, users)
  await migrateQuizAnswers(quizzes, users, data.quizAnswers)
  await migrateSpamFlags(users, data.spamFlags)
  await migratePeerReviews(users, data.peerReviews, manager)

  await manager.query(
    `insert into migration (date) values ('${new Date(
      now - 10 * 60000,
    ).toISOString()}')`,
  )

  timer.done({ message: "Migration complete" })
  console.timeEnd("Database migration complete. Time used")

  process.exit()
}

main().catch(console.error)
