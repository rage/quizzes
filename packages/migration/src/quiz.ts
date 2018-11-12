import {
  Course,
  Quiz,
  QuizItem,
  QuizItemTranslation,
  QuizOption,
  QuizOptionTranslation,
  QuizTranslation,
} from "@quizzes/common/models"
import { Quiz as QNQuiz } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import oldQuizTypes from "./app-modules/constants/quiz-types"
import { getUUIDByString, insert } from "@quizzes/common/util"
import { progressBar, safeGet } from "./util"
import { AdvancedConsoleLogger } from "typeorm"

export async function migrateQuizzes(courses: {
  [key: string]: Course
}): Promise<{ [quizID: string]: Quiz }> {
  const eaiRegex = /ai_([0-9])_([0-9])/

  console.log("Querying quizzes...")
  const oldQuizzes = await QNQuiz.find({
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
  })
  const quizzes: Array<QueryPartialEntity<Quiz>> = []
  const quizTranslations: Array<QueryPartialEntity<QuizTranslation>> = []
  const quizItems: Array<QueryPartialEntity<QuizItem>> = []
  const quizItemTranslations: Array<
    QueryPartialEntity<QuizItemTranslation>
  > = []
  const quizOptions: Array<QueryPartialEntity<QuizOption>> = []
  const quizOptionTranslations: Array<
    QueryPartialEntity<QuizOptionTranslation>
  > = []

  const bar = progressBar("Converting quizzes", oldQuizzes.length)
  for (const oldQuiz of oldQuizzes) {
    let part = 0
    let section = 0
    let excludedFromScore = false
    let course: Course = courses[getUUIDByString("default")]
    for (const tag of oldQuiz.tags) {
      if (tag === "ignore") {
        excludedFromScore = true
        continue
      }

      const tagUUID = getUUIDByString(tag)
      if (tagUUID in courses) {
        course = courses[tagUUID]
        continue
      }

      const match = tag.match(eaiRegex)
      if (match) {
        part = parseInt(match[1], 10)
        section = parseInt(match[2], 10)
      }
    }

    const languageId = course.languages[0].id
    if (!course || !course.languages || !languageId) {
      throw Error(JSON.stringify(course))
    }
    const quiz: QueryPartialEntity<Quiz> = {
      id: getUUIDByString(oldQuiz._id),
      course,
      courseId: course.id,
      part,
      section,
      excludedFromScore,
      createdAt: oldQuiz.createdAt,
      updatedAt: oldQuiz.updatedAt,
    }
    quizzes.push(quiz)
    if (!quiz.course) {
      console.log("course: ", quiz.course)
    }
    quizTranslations.push({
      quizId: quiz.id,
      languageId,
      title: oldQuiz.title,
      body: oldQuiz.body,
      submitMessage: safeGet(() => oldQuiz.data.meta.submitMessage),
      createdAt: oldQuiz.createdAt,
      updatedAt: oldQuiz.updatedAt,
    })

    let order: number
    let choiceOrder: number
    const meta = safeGet(() => oldQuiz.data.meta) || {}
    const rightAnswer = safeGet(() => meta.rightAnswer)
    const successes = safeGet(() => meta.successes) || {}
    const errors = safeGet(() => meta.errors) || {}
    const oldItems = safeGet(() => oldQuiz.data.items) || []
    const oldChoices = safeGet(() => oldQuiz.data.choices) || []
    switch (oldQuiz.type) {
      case oldQuizTypes.ESSAY:
      case oldQuizTypes.OPEN:
        quizItems.push({
          id: getUUIDByString(oldQuiz._id),
          quizId: quiz.id,
          type: oldQuiz.type === oldQuizTypes.ESSAY ? "essay" : "open",
          validityRegex: rightAnswer,
          order: 0,
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        quizItemTranslations.push({
          quizItemId: getUUIDByString(oldQuiz._id),
          languageId,
          successMessage: meta.success,
          failureMessage: meta.error,
        })
        break

      case oldQuizTypes.MULTIPLE_OPEN:
      case oldQuizTypes.SCALE:
        order = 0
        for (const oldItem of oldItems) {
          const qiid = getUUIDByString(quiz.id + oldItem.id)
          quizItems.push({
            id: qiid,
            quizId: quiz.id,
            type: oldQuiz.type === oldQuizTypes.SCALE ? "scale" : "open",
            validityRegex: rightAnswer ? rightAnswer[oldItem.id] : undefined,
            order: order++,
            createdAt: oldQuiz.createdAt,
            updatedAt: oldQuiz.updatedAt,
          })
          quizItemTranslations.push({
            quizItemId: qiid,
            languageId,
            successMessage: meta.success,
            failureMessage: meta.error,
            title: oldItem.title,
            body: oldItem.body,
          })
        }
        break

      case oldQuizTypes.MULTIPLE_CHOICE:
      case oldQuizTypes.PRIVACY_AGREEMENT:
      case oldQuizTypes.CHECKBOX:
        const itemID = getUUIDByString(oldQuiz._id)
        quizItems.push({
          id: itemID,
          quizId: quiz.id,
          type:
            oldQuiz.type !== oldQuizTypes.MULTIPLE_CHOICE
              ? oldQuiz.type !== oldQuizTypes.CHECKBOX
                ? "research-agreement"
                : "checkbox"
              : "radio",
          order: 0,
          createdAt: oldQuiz.createdAt,
          updatedAt: oldQuiz.updatedAt,
        })
        quizItemTranslations.push({
          quizItemId: itemID,
          languageId,
          successMessage: meta.success,
          failureMessage: meta.error,
          title: oldQuiz.title,
          body: oldQuiz.body,
        })
        choiceOrder = 0
        for (const oldChoice of oldItems) {
          const qoid = getUUIDByString(quiz.id + itemID + oldChoice.id)
          const correct =
            oldQuiz.type === oldQuizTypes.PRIVACY_AGREEMENT ||
            rightAnswer === oldChoice.id ||
            (Array.isArray(rightAnswer) && rightAnswer.includes(oldChoice.id))
          quizOptions.push({
            id: qoid,
            quizItemId: itemID,
            order: choiceOrder++,
            correct: typeof correct === "boolean" ? correct : true,
            createdAt: oldQuiz.createdAt,
            updatedAt: oldQuiz.updatedAt,
          })
          quizOptionTranslations.push({
            quizOptionId: qoid,
            languageId,
            successMessage: successes[oldChoice.id], // safeGet(() => meta.successes[oldChoice.id]),
            failureMessage: errors[oldChoice.id], // safeGet(() => meta.errors[oldChoice.id]),
            title: oldChoice.title,
            body: oldChoice.body,
          })
        }
        break

      case oldQuizTypes.RADIO_MATRIX:
        order = 0

        for (const oldItem of oldItems) {
          const qiid = getUUIDByString(quiz.id + oldItem.id)
          quizItems.push({
            id: qiid,
            quizId: quiz.id,
            type: "radio",
            order: order++,
            createdAt: oldQuiz.createdAt,
            updatedAt: oldQuiz.updatedAt,
          })
          quizItemTranslations.push({
            quizItemId: qiid,
            languageId,
            successMessage: successes[oldItem.id],
            failureMessage: errors[oldItem.id],
            title: oldItem.title,
            body: oldItem.body,
          })

          choiceOrder = 0
          for (const oldChoice of oldChoices) {
            const qoid = getUUIDByString(quiz.id + qiid + oldChoice.id)
            quizOptions.push({
              id: qoid,
              quizItemId: qiid,
              order: choiceOrder++,
              correct:
                rightAnswer[oldItem.id] === oldChoice.id ||
                rightAnswer[oldItem.id].includes(oldChoice.id),
              createdAt: oldQuiz.createdAt,
              updatedAt: oldQuiz.updatedAt,
            })
            quizOptionTranslations.push({
              quizOptionId: qoid,
              languageId,
              title: oldChoice.title,
              body: oldChoice.body,
            })
          }
        }
        break

      default:
        console.warn("Unhandled quiz:", oldQuiz)
    }
    bar.tick()
  }

  console.log("Inserting quizzes...", quizzes.length)
  await insert(Quiz, quizzes)
  await insert(QuizTranslation, quizTranslations, `"quiz_id", "language_id"`)
  await insert(QuizItem, quizItems)
  await insert(
    QuizItemTranslation,
    quizItemTranslations,
    `"quiz_item_id", "language_id"`,
  )
  await insert(QuizOption, quizOptions)
  await insert(
    QuizOptionTranslation,
    quizOptionTranslations,
    `"quiz_option_id", "language_id"`,
  )

  console.log("Querying inserted quizzes...")
  const newQuizzes: { [quizID: string]: Quiz } = {}
  for (const quiz of await Quiz.find({})) {
    newQuizzes[quiz.id] = quiz
  }
  return newQuizzes
}
