import { Connection } from "typeorm"
import getUUIDByStringBroken from "uuid-by-string"

import database from "../../database"
import {
  Course,
  Language,
  Organization,
  Quiz,
  QuizItem,
  QuizItemTranslation,
  QuizOption,
  QuizOptionTranslation,
  QuizTranslation,
} from "../../models"

import oldQuizTypes from "./app-modules/constants/quiz-types"
import { Quiz as QNQuiz } from "./app-modules/models"
import mongoUtils from "./mongo_utils"

function getUUIDByString(str: string): string {
  return getUUIDByStringBroken("_" + str)
}

async function main() {
  const db = await database.promise

  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/quiznator",
  )
  const quizzes = await QNQuiz.find({})

  const courseIDs = {
    "cybersecurity-intro": "en_US",
    "cybersecurity-securing-software": "en_US",
    "cybersecurity-advanced": "en_US",
    "cybersecurity-intro-17": "en_US",
    "cybersecurity-securing-17": "en_US",
    "cybersecurity-advanced-17": "en_US",
    "securing-17": "en_US",
    "cyber-advanced-17": "en_US",
    "cyber-advanced-18": "en_US",

    "elements-of-ai": "en_US",

    "k2017-ohpe": "fi_FI",
    "s2017-ohpe": "fi_FI",
    "k2018-ohpe": "fi_FI",

    "s2017-ohja": "fi_FI",
    "k2018-ohja": "fi_FI",

    "wepa-s17": "fi_FI",

    "tikape-s17": "fi_FI",
    "tikape-k18": "fi_FI",

    "tsoha-18": "fi_FI",
  }
  const eaiRegex = /ai_([0-9])_([0-9])/
  await Organization.merge(Organization.create({ id: 0 })).save()
  await Language.merge(
    Language.create({ id: "fi_FI", country: "Finland", name: "Finnish" }),
  ).save()
  await Language.merge(
    Language.create({ id: "en_US", country: "United States", name: "English" }),
  ).save()
  const org = await Organization.findOne(0)
  const courses: { [key: string]: Course } = {}
  for (const [courseID, languageID] of Object.entries(courseIDs)) {
    const uuid = getUUIDByString(courseID)
    console.log("Creating course", uuid, courseID, languageID)
    courses[courseID] = Course.merge(
      Course.create({
        id: uuid,
        organization: org,
        languages: [await Language.findOne(languageID)],
      }),
    )
    courses[courseID].save()
  }

  const types = new Set()
  for (const quiz of quizzes) {
    let part = 1
    let section = 1
    let course: Course
    for (const tag of quiz.tags) {
      const match = tag.match(eaiRegex)
      if (match) {
        part = parseInt(match[1], 10)
        section = parseInt(match[2], 10)
      }
      if (tag in courses) {
        course = courses[tag]
        break
      }
    }
    if (!course) {
      continue
    }

    types.add(quiz.type)
    try {
      await migrate_quiz(db, course, quiz, part, section)
    } catch (e) {
      console.error(
        "Failed to migrate quiz",
        require("util").inspect(quiz, false, null),
      )
      throw e
    }
  }
  console.log(types)
}

function safeGet<T>(func: () => T, def?: any): T {
  try {
    return func()
  } catch (e) {
    return def
  }
}

async function migrate_quiz(
  db: Connection,
  course: Course,
  oldQuiz: any,
  part: number,
  section: number = null,
) {
  const language = course.languages[0]
  const quiz = Quiz.create({
    id: getUUIDByString(oldQuiz._id),
    course,
    part,
    section,
    createdAt: oldQuiz.createdAt,
    updatedAt: oldQuiz.updatedAt,
  })
  await quiz.save()
  quiz.texts = [
    QuizTranslation.create({
      quiz: quiz.id,
      language,
      title: oldQuiz.title || "",
      body: oldQuiz.body || "",
      submitMessage: safeGet(() => oldQuiz.data.meta.submitMessage),
      createdAt: oldQuiz.createdAt,
      updatedAt: oldQuiz.updatedAt,
    }),
  ]
  await quiz.texts[0].save()

  let item: QuizItem
  let order: number
  let choiceOrder: number
  const meta = safeGet(() => oldQuiz.data.meta, {})
  const rightAnswer = safeGet(() => meta.rightAnswer)
  const successes = safeGet(() => meta.successes)
  const errors = safeGet(() => meta.errors)
  const items = safeGet(() => oldQuiz.data.items, [])
  const choices = safeGet(() => oldQuiz.data.choices, [])
  switch (oldQuiz.type) {
    case oldQuizTypes.ESSAY:
    case oldQuizTypes.OPEN:
      console.log("Migrating open/essay", oldQuiz)
      item = QuizItem.create({
        id: getUUIDByString(oldQuiz._id),
        quiz,
        type: oldQuiz.type === oldQuizTypes.ESSAY ? "essay" : "open",
        validityRegex: rightAnswer,
        order: 0,
        createdAt: oldQuiz.createdAt,
        updatedAt: oldQuiz.updatedAt,
      })
      await item.save()
      item.texts = [
        QuizItemTranslation.create({
          quizItem: item.id,
          language,
          successMessage: meta.success || "",
          failureMessage: meta.error || "",
          title: "",
          body: "",
        }),
      ]
      await item.texts[0].save()
      break

    case oldQuizTypes.MULTIPLE_OPEN:
      console.log("Migrating multiple open", oldQuiz)
      order = 0
      for (const oldItem of items) {
        console.log(
          "Migrating multiple open item",
          oldItem,
          getUUIDByString(oldItem.id),
        )
        item = QuizItem.create({
          id: getUUIDByString(oldQuiz.id + oldItem.id),
          quiz,
          type: "open",
          validityRegex: rightAnswer[oldItem.id],
          order: order++,
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        await item.save()
        item.texts = [
          QuizItemTranslation.create({
            quizItem: item.id,
            language,
            successMessage: meta.success || "",
            failureMessage: meta.error || "",
            title: oldItem.title || "",
            body: oldItem.body || "",
          }),
        ]
        await item.texts[0].save()
      }
      break

    case oldQuizTypes.MULTIPLE_CHOICE:
      console.log("Migrating multiple choice", oldQuiz)
      item = QuizItem.create({
        id: getUUIDByString(oldQuiz._id),
        quiz,
        type: "multiple-choice",
        order: 0,
        createdAt: oldQuiz.createdAt,
        updatedAt: oldQuiz.updatedAt,
      })
      await item.save()
      item.texts = [
        QuizItemTranslation.create({
          quizItem: item.id,
          language,
          title: "",
          body: "",
          successMessage: meta.success || "",
          failureMessage: meta.error || "",
        }),
      ]
      await item.texts[0].save()
      choiceOrder = 0
      for (const oldChoice of items) {
        console.log(
          "Migrating multiple choice option",
          oldChoice,
          getUUIDByString(oldChoice.id),
        )
        const option = QuizOption.create({
          id: getUUIDByString(oldQuiz.id + oldChoice.id),
          quizItem: item,
          order: choiceOrder++,
          correct:
            rightAnswer === oldChoice.id || rightAnswer.includes(oldChoice.id),
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        await option.save()
        option.texts = [
          QuizOptionTranslation.create({
            quizOption: option.id,
            language,
            successMessage: meta.success || "",
            failureMessage: meta.error || "",
            title: oldChoice.title || "",
            body: oldChoice.body || "",
          }),
        ]
        await option.texts[0].save()
      }
      break

    case oldQuizTypes.RADIO_MATRIX:
      console.log("Migrating radio matrix", oldQuiz)
      order = 0

      for (const oldItem of items) {
        console.log("Migrating radio matrix item", oldItem)
        item = QuizItem.create({
          id: getUUIDByString(oldQuiz.id + oldItem.id),
          quiz,
          type: "multiple-choice",
          validityRegex: rightAnswer[oldItem.id],
          order: order++,
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        await item.save()
        item.texts = [
          QuizItemTranslation.create({
            quizItem: item.id,
            language,
            successMessage: successes[oldItem.id] || "",
            failureMessage: errors[oldItem.id] || "",
            title: oldItem.title || "",
            body: oldItem.body || "",
          }),
        ]
        await item.texts[0].save()

        choiceOrder = 0
        for (const oldChoice of choices) {
          console.log(
            "Migrating radio matrix choices",
            oldChoice,
            getUUIDByString(oldChoice.id),
          )
          const option = QuizOption.create({
            id: getUUIDByString(oldQuiz.id + oldItem.id + oldChoice.id),
            quizItem: item,
            order: choiceOrder++,
            correct:
              rightAnswer[oldItem.id] === oldChoice.id ||
              rightAnswer[oldItem.id].includes(oldChoice.id),
            createdAt: oldQuiz.createdAt,
            updatedAt: oldQuiz.updatedAt,
          })
          await option.save()
          option.texts = [
            QuizOptionTranslation.create({
              quizOption: option.id,
              language,
              successMessage: "",
              failureMessage: "",
              title: oldChoice.title || "",
              body: oldChoice.body || "",
            }),
          ]
          await option.texts[0].save()
        }
      }
      break

    default:
      console.warn("Unhandled quiz:", oldQuiz)
  }
}

main().catch(console.error)
