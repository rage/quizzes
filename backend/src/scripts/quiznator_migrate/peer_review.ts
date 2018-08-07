import { Connection } from "typeorm"

import oldQuizTypes from "./app-modules/constants/quiz-types"
import { Quiz as QNQuiz } from "./app-modules/models"

import { Course } from "../../models"

export async function migratePeerReviewQuestions(
  db: Connection,
  courses: { [key: string]: Course },
) {
  const eaiRegex = /ai_([0-9])_([0-9])/

  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })
  // TODO implement
}
