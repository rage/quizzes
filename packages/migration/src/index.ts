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

const data = {
  quizAnswers: [
    {
      _id: "5c4ac89e017ffc13eddc8835",
      updatedAt: "2019-01-25T08:28:14.391Z",
      createdAt: "2019-01-25T08:28:14.391Z",
      data: ["jllyf5ja1z"],
      answererId: "sparkling-earwig-67645",
      quizId: "5c498c7c017ffc13eddc84f1",
      deprecated: false,
      rejected: false,
      confirmed: true,
      peerReviewCount: 0,
      spamFlags: 0,
      __v: 0,
    },
  ],
}

const user = new User()
user.id = 34176

const users = {
  "sparkling-earwig-67645": user,
}

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `${appRoot.path}/.env` })
}

async function main() {
  logger.info("Connecting to Postgres")
  const database = Container.get(Database)
  const connection = await database.connect()
  const manager = connection.createEntityManager()

  const quiz: Quiz = await manager
    .createQueryBuilder(Quiz, "quiz")
    .leftJoinAndSelect("quiz.course", "course")
    .leftJoinAndSelect("course.texts", "course_translation")
    .leftJoinAndSelect("course.languages", "language")
    .leftJoinAndSelect("quiz.items", "item")
    .leftJoinAndSelect("item.options", "option")
    .where("quiz.id = :id", { id: "3ec7c1cc-27f5-4518-890a-201a9fe6121d" })
    .getOne()

  const quizzes = {
    "3ec7c1cc-27f5-4518-890a-201a9fe6121d": quiz,
  }

  /*const migrations = await manager.query(
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

  /*Migration started")
  console.time("Database migration complete. Time used")
  const timer = logger.startTimer()
  const org = await Organization.merge(Organization.create({ id: 0 })).save()

  const languages = await createLanguages()
  const courses = await migrateCourses(org, languages)
  const quizzes = await migrateQuizzes(courses, data.quizzes)
  await migratePeerReviewQuestions(data.peerReviewQuizzes, data.peerReviews)
  const users = await migrateUsers(data.usernames)*/
  // await migrateCourseStates(courses, users)
  const existingAnswers = await migrateQuizAnswers(
    quizzes,
    users,
    data.quizAnswers,
  )
  /*await migrateSpamFlags(users, data.spamFlags)
  await migratePeerReviews(users, existingAnswers, data.peerReviews)

  await manager.query(
    `insert into migration (date) values ('${new Date(
      now - 10 * 60000,
    ).toISOString()}')`,
  )

  timer.done({ message: "Migration complete" })
  console.timeEnd("Database migration complete. Time used")

  process.exit()*/
}

main().catch(console.error)
