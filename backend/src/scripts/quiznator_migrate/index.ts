import { Connection } from "typeorm"
import getUUIDByString from "uuid-by-string"

import database from "../../database"
import {
  Course,
  Language,
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

async function main() {
  const db = await database.promise

  await mongoUtils.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/quiznator",
  )
  const quizzes = await QNQuiz.find({})
  const tags = new Set()
  for (const quiz of quizzes) {
    for (const tag of quiz.tags) {
      tags.add(tag)
    }
  }
  console.log(tags)
}

async function migrate_quiz(
  db: Connection,
  course: Course,
  oldQuiz: any,
  part: number,
  section: number = null,
) {
  const lang = await Language.findOne("en_US")

  const quiz = Quiz.create({
    id: getUUIDByString(oldQuiz._id),
    course,
    part,
    section,
    texts: [
      QuizTranslation.create({
        language: lang,
        title: oldQuiz.title,
        body: oldQuiz.body,
        submitMessage: oldQuiz.data.meta.submitMessage,
        createdAt: oldQuiz.createdAt,
        updatedAt: oldQuiz.updatedAt,
      }),
    ],
    createdAt: oldQuiz.createdAt,
    updatedAt: oldQuiz.updatedAt,
  })
  await quiz.save()

  let item: QuizItem
  let option: QuizOption
  let order: number
  switch (oldQuiz.type) {
    case oldQuizTypes.ESSAY:
    case oldQuizTypes.OPEN:
      item = QuizItem.create({
        quiz,
        type: oldQuiz.type === oldQuizTypes.ESSAY ? "essay" : "open",
        texts: [
          QuizItemTranslation.create({
            successMessage: oldQuiz.data.meta.success,
            failureMessage: oldQuiz.data.meta.error,
          }),
        ],
        validityRegex: oldQuiz.data.meta.rightAnswer,
        order: 0,
        createdAt: oldQuiz.createdAt,
        updatedAt: oldQuiz.updatedAt,
      })
      await item.save()
      break

    case oldQuizTypes.MULTIPLE_OPEN:
      order = 0
      for (const oldItem of oldQuiz.items) {
        item = QuizItem.create({
          quiz,
          type: "open",
          texts: [
            QuizItemTranslation.create({
              successMessage: oldQuiz.data.meta.success,
              failureMessage: oldQuiz.data.meta.error,
              title: oldItem.title,
              body: oldItem.body,
            }),
          ],
          validityRegex: oldQuiz.data.meta.rightAnswer[oldItem.id],
          order: order++,
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        await item.save()
      }
      break

    case oldQuizTypes.MULTIPLE_CHOICE:
      item = QuizItem.create({
        quiz,
        type: "multiple-choice",
        texts: [
          QuizItemTranslation.create({
            successMessage: oldQuiz.data.meta.success,
            failureMessage: oldQuiz.data.meta.error,
          }),
        ],
        order: 0,
        createdAt: oldQuiz.createdAt,
        updatedAt: oldQuiz.updatedAt,
      })
      await item.save()
      for (const oldChoice of oldQuiz.items) {
        option = QuizOption.create({
          quizItem: item,
          texts: [
            QuizOptionTranslation.create({
              successMessage: oldQuiz.data.meta.success,
              failureMessage: oldQuiz.data.meta.error,
              title: oldChoice.title,
              body: oldChoice.body,
            }),
          ],
          correct:
            oldQuiz.data.meta.rightAnswer === oldChoice.id ||
            oldQuiz.data.meta.rightAnswer.includes(oldChoice.id),
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        await option.save()
      }
      break

    case oldQuizTypes.RADIO_MATRIX:
      order = 0
      for (const oldItem of oldQuiz.items) {
        item = QuizItem.create({
          quiz,
          type: "multiple-choice",
          texts: [
            QuizItemTranslation.create({
              successMessage: oldQuiz.data.meta.successes[oldItem.id],
              failureMessage: oldQuiz.data.meta.errors[oldItem.id],
              title: oldItem.title,
              body: oldItem.body,
            }),
          ],
          validityRegex: oldQuiz.data.meta.rightAnswer[oldItem.id],
          order: order++,
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        await item.save()

        for (const oldChoice of oldQuiz.items) {
          option = QuizOption.create({
            quizItem: item,
            texts: [
              QuizOptionTranslation.create({
                title: oldChoice.title,
                body: oldChoice.body,
              }),
            ],
            correct:
              oldQuiz.data.meta.rightAnswer[oldItem.id] === oldChoice.id ||
              oldQuiz.data.meta.rightAnswer[oldItem.id].includes(oldChoice.id),
            createdAt: oldQuiz.createdAt,
            updatedAt: oldQuiz.updatedAt,
          })
          await option.save()
        }
      }
  }
}

main().catch(console.error)
