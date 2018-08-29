import { PrivacyAgreement as QNPrivacyAgreement } from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  QuizOption,
  QuizOptionAnswer,
  User,
} from "../../models"
import { getUUIDByString, insert } from "./util"

export async function migrateResearchAgreements(
  quizzes: { [quizID: string]: Quiz },
  users: { [userID: string]: User },
) {
  console.log("Querying privacy agreements...")
  const privacyAgreements = await QNPrivacyAgreement.find({})

  const quizAnswers: Array<QueryPartialEntity<QuizAnswer>> = []
  const quizItemAnswers: Array<QueryPartialEntity<QuizItemAnswer>> = []
  const quizOptionAnswers: Array<QueryPartialEntity<QuizOptionAnswer>> = []

  console.log("Converting privacy agreements to research agreements...")
  for (const pa of privacyAgreements) {
    const quiz = quizzes[getUUIDByString(pa.quizId)]
    if (!quiz) {
      continue
    }

    const user = users[pa.answererId]
    if (!user) {
      continue
    }

    const id = getUUIDByString(pa._id)
    quizAnswers.push({
      id,
      quizId: quiz.id,
      userId: user.id,
      status: "confirmed",
      languageId: quiz.course.languages[0].id,
      createdAt: pa.createdAt,
      updatedAt: pa.updatedAt,
    })

    const item = (await quiz.items)[0]
    quizItemAnswers.push({
      id,
      quizAnswerId: id,
      quizItemId: item.id,
      textData: "",
      createdAt: pa.createdAt,
      updatedAt: pa.updatedAt,
    })

    const quizOptions: {
      [optionID: string]: QuizOption
    } = {}
    for (const option of await item.options) {
      quizOptions[option.id] = option
    }

    for (const entry of pa.accepted || []) {
      const optionID = getUUIDByString(quiz.id + item.id + entry)
      if (!(optionID in quizOptions)) {
        continue
      }
      quizOptionAnswers.push({
        id: optionID,
        quizItemAnswerId: id,
        quizOptionId: optionID,
        createdAt: pa.createdAt,
        updatedAt: pa.updatedAt,
      })
    }
  }

  console.log("Inserting research agreements...")
  const answerChunk = 9300
  for (let i = 0; i < quizAnswers.length; i += answerChunk) {
    await insert(QuizAnswer, quizAnswers.slice(i, i + answerChunk))
  }
  const itemAnswerChunk = 10900
  for (let i = 0; i < quizItemAnswers.length; i += itemAnswerChunk) {
    await insert(QuizItemAnswer, quizItemAnswers.slice(i, i + itemAnswerChunk))
  }
  const optionAnswerChunk = 13100
  for (let i = 0; i < quizOptionAnswers.length; i += optionAnswerChunk) {
    await insert(
      QuizOptionAnswer,
      quizOptionAnswers.slice(i, i + optionAnswerChunk),
    )
  }
}
