import { Connection } from "typeorm"

import oldQuizTypes from "./app-modules/constants/quiz-types"
import { Quiz as QNQuiz } from "./app-modules/models"

import {
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
  Quiz,
} from "../../models"
import { getUUIDByString, safeGet } from "./util"

export async function migratePeerReviewQuestions(
  db: Connection,
  quizzes: { [quizID: string]: Quiz },
): Promise<{ [prqID: string]: PeerReviewQuestion }> {
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const newQuestions: { [prqID: string]: PeerReviewQuestion } = {}
  for (const oldPRQ of peerReviewQuestions) {
    const quiz = quizzes[getUUIDByString(safeGet(() => oldPRQ.data.quizId))]
    if (!quiz) {
      console.warn("Quiz not found for peer review", oldPRQ)
      continue
    }
    try {
      const prq = await migratePeerReviewQuestion(db, quiz, oldPRQ)
      newQuestions[prq.id] = prq
    } catch (e) {
      console.error("Failed to migrate peer review question", oldPRQ)
      throw e
    }
  }
  return newQuestions
}

export async function migratePeerReviewQuestion(
  db: Connection,
  quiz: Quiz,
  oldPRQ: { [key: string]: any },
): Promise<PeerReviewQuestion> {
  const language = quiz.course.languages[0]
  const prq = PeerReviewQuestion.create({
    id: getUUIDByString(oldPRQ._id),
    quiz,
    default: false,
    type: "essay",
    answerRequired: oldPRQ.data.answeringRequired,
  })
  await prq.save()
  prq.texts = [
    PeerReviewQuestionTranslation.create({
      peerReviewQuestion: prq.id,
      language,
      title: oldPRQ.title || "",
      body: oldPRQ.body || "",
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    }),
  ]
  await prq.texts[0].save()
  return prq
}
