import oldQuizTypes from "./app-modules/constants/quiz-types"
import {
  PeerReview as QNPeerReview,
  Quiz as QNQuiz,
} from "./app-modules/models"

import {
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
  Quiz,
} from "../../models"
import { getUUIDByString, progressBar, safeGet } from "./util"

export async function migratePeerReviewQuestions(quizzes: {
  [quizID: string]: Quiz
}): Promise<{ [prqID: string]: PeerReviewQuestion[] }> {
  console.log("Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const newQuestions: { [prqID: string]: PeerReviewQuestion[] } = {}
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
      const prqs = await migratePeerReviewQuestion(quiz, oldPRQ)
      if (!prqs || prqs.length === 0) {
        continue
      }
      newQuestions[oldPRQ._id] = prqs
      quiz.peerReviewQuestions = Promise.resolve(prqs)
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
): Promise<PeerReviewQuestion[]> {
  const language = quiz.course.languages[0]

  const peerReviewSample = await QNPeerReview.findOne({
    $or: [{ quizId: oldPRQ._id }, { sourceQuizId: oldPRQ._id }],
  })
  if (!peerReviewSample) {
    return []
  }

  const newPRQ = async (
    id: string,
    type: string,
    title: string = "",
    body: string = "",
  ) => {
    const prq = await PeerReviewQuestion.create({
      id: getUUIDByString(id),
      quiz,
      default: false,
      type,
      answerRequired: oldPRQ.data.answeringRequired,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    }).save()
    prq.texts = [
      await PeerReviewQuestionTranslation.create({
        peerReviewQuestion: prq.id,
        language,
        title,
        body,
        createdAt: oldPRQ.createdAt,
        updatedAt: oldPRQ.updatedAt,
      }).save(),
    ]
    return prq
  }

  const reviewQuestions = []

  if (peerReviewSample.review && peerReviewSample.review !== "n/a") {
    reviewQuestions.push(
      await newPRQ(oldPRQ._id, "essay", oldPRQ.title, oldPRQ.body),
    )
  }
  if (peerReviewSample.grading) {
    for (const question of Object.keys(peerReviewSample.grading)) {
      reviewQuestions.push(
        await newPRQ(oldPRQ._id + question, "grade", oldPRQ.title, question),
      )
    }
  }

  return reviewQuestions
}
