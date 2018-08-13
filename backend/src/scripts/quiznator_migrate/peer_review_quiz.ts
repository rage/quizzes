import oldQuizTypes from "./app-modules/constants/quiz-types"
import { Quiz as QNQuiz } from "./app-modules/models"

import {
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
  Quiz,
} from "../../models"
import { getUUIDByString, progressBar, safeGet } from "./util"

export async function migratePeerReviewQuestions(quizzes: {
  [quizID: string]: Quiz
}): Promise<{ [prqID: string]: PeerReviewQuestion }> {
  console.log("Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const newQuestions: { [prqID: string]: PeerReviewQuestion } = {}
  const bar = progressBar(
    "Migrating peer review questions",
    peerReviewQuestions.length,
  )
  for (const oldPRQ of peerReviewQuestions) {
    const quiz = quizzes[getUUIDByString(safeGet(() => oldPRQ.data.quizId))]
    if (!quiz) {
      continue
    }
    try {
      const prq = await migratePeerReviewQuestion(quiz, oldPRQ)
      newQuestions[prq.id] = prq
      quiz.peerReviewQuestions = Promise.resolve([prq])
      bar.tick()
    } catch (e) {
      console.error("Failed to migrate peer review question", oldPRQ)
      throw e
    }
  }
  return newQuestions
}

async function migratePeerReviewQuestion(
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
