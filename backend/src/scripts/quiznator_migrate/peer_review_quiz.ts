import oldQuizTypes from "./app-modules/constants/quiz-types"
import {
  PeerReview as QNPeerReview,
  Quiz as QNQuiz,
} from "./app-modules/models"

import {
  PeerReviewQuestion,
  PeerReviewQuestionCollection,
  PeerReviewQuestionCollectionTranslation,
  PeerReviewQuestionTranslation,
  Quiz,
} from "../../models"
import { getUUIDByString, progressBar, safeGet } from "./util"

export async function migratePeerReviewQuestions() {
  console.log("Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const newQuestionCollections: {
    [prqID: string]: PeerReviewQuestionCollection
  } = {}

  const bar = progressBar(
    "Migrating peer review questions",
    peerReviewQuestions.length,
  )
  await Promise.all(
    peerReviewQuestions.map(async (oldPRQ: any) => {
      const quiz = await Quiz.findOne(
        getUUIDByString(safeGet(() => oldPRQ.data.quizId)),
      )
      if (!quiz) {
        return
      }
      const prqc = await migratePeerReviewQuestion(quiz, oldPRQ)
      if (!prqc) {
        return
      }
      newQuestionCollections[prqc.id] = prqc
      bar.tick()
    }),
  )
  return newQuestionCollections
}

async function migratePeerReviewQuestion(
  quiz: Quiz,
  oldPRQ: { [key: string]: any },
): Promise<PeerReviewQuestionCollection> {
  const languageId = quiz.course.languages[0].id

  const peerReviewSample = await QNPeerReview.findOne({
    $or: [{ quizId: oldPRQ._id }, { sourceQuizId: oldPRQ._id }],
  })
  if (!peerReviewSample) {
    return null
  }

  const prqc = await PeerReviewQuestionCollection.create({
    id: getUUIDByString(oldPRQ._id),
    quizId: quiz.id,
    createdAt: oldPRQ.createdAt,
    updatedAt: oldPRQ.updatedAt,
  }).save()
  prqc.texts = [
    await PeerReviewQuestionCollectionTranslation.create({
      peerReviewQuestionCollection: prqc.id,
      languageId,
      title: oldPRQ.title || "",
      body: oldPRQ.body || "",
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    }).save(),
  ]

  let order = 1
  const newPRQ = async (
    id: string,
    type: string,
    title: string = "",
    body: string = "",
  ) => {
    const prq = await PeerReviewQuestion.create({
      id: getUUIDByString(id),
      quizId: quiz.id,
      collection: prqc,
      default: false,
      type,
      order: order++,
      answerRequired: oldPRQ.data.answeringRequired,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    }).save()
    prq.texts = [
      await PeerReviewQuestionTranslation.create({
        peerReviewQuestion: prq.id,
        languageId,
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
    reviewQuestions.push(await newPRQ(oldPRQ._id + "essay", "essay"))
  }
  if (peerReviewSample.grading) {
    for (const question of Object.keys(peerReviewSample.grading)) {
      reviewQuestions.push(
        await newPRQ(oldPRQ._id + question, "grade", question),
      )
    }
  }
  prqc.questions = Promise.resolve(reviewQuestions)
  return prqc
}
