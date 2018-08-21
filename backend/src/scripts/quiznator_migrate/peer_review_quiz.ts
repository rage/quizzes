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

export async function migratePeerReviewQuestions(quizzes: {
  [quizID: string]: Quiz
}): Promise<{ [prqID: string]: PeerReviewQuestionCollection }> {
  console.log("Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const newQuestionCollections: {
    [prqID: string]: PeerReviewQuestionCollection
  } = {}

  const existingPRQCs = await PeerReviewQuestionCollection.find({})
  if (existingPRQCs.length > 0) {
    console.log(
      "Existing peer review questions found in database, skipping migration",
    )
    for (const prqc of existingPRQCs) {
      newQuestionCollections[prqc.id] = prqc
    }
    return newQuestionCollections
  }

  const bar = progressBar(
    "Migrating peer review questions",
    peerReviewQuestions.length,
  )
  for (const oldPRQ of peerReviewQuestions) {
    const quiz = quizzes[getUUIDByString(safeGet(() => oldPRQ.data.quizId))]
    if (!quiz) {
      bar.tick() // TODO handle skips?
      continue
    }
    try {
      const prqc = await migratePeerReviewQuestion(quiz, oldPRQ)
      if (!prqc) {
        bar.tick() // TODO handle skips?
        continue
      }
      newQuestionCollections[prqc.id] = prqc
      quiz.peerReviewQuestions = Promise.resolve(
        (await quiz.peerReviewQuestions).concat(await prqc.questions),
      )
      bar.tick()
    } catch (e) {
      console.error("Failed to migrate peer review question", oldPRQ)
      throw e
    }
  }
  return newQuestionCollections
}

async function migratePeerReviewQuestion(
  quiz: Quiz,
  oldPRQ: { [key: string]: any },
): Promise<PeerReviewQuestionCollection> {
  const language = (await (await quiz.course).languages)[0]

  const peerReviewSample = await QNPeerReview.findOne({
    $or: [{ quizId: oldPRQ._id }, { sourceQuizId: oldPRQ._id }],
  })
  if (!peerReviewSample) {
    return null
  }

  const prqc = await PeerReviewQuestionCollection.create({
    id: getUUIDByString(oldPRQ._id),
    quiz: Promise.resolve(quiz),
    createdAt: oldPRQ.createdAt,
    updatedAt: oldPRQ.updatedAt,
  }).save()
  prqc.texts = Promise.resolve([
    await PeerReviewQuestionCollectionTranslation.create({
      peerReviewQuestionCollection: prqc.id,
      language: Promise.resolve(language),
      title: oldPRQ.title || "",
      body: oldPRQ.body || "",
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    }).save(),
  ])

  let order = 1
  const newPRQ = async (
    id: string,
    type: string,
    title: string = "",
    body: string = "",
  ) => {
    const prq = await PeerReviewQuestion.create({
      id: getUUIDByString(id),
      quiz: Promise.resolve(quiz),
      collection: Promise.resolve(prqc),
      default: false,
      type,
      order: order++,
      answerRequired: oldPRQ.data.answeringRequired,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    }).save()
    prq.texts = Promise.resolve([
      await PeerReviewQuestionTranslation.create({
        peerReviewQuestion: prq.id,
        language: Promise.resolve(language),
        title,
        body,
        createdAt: oldPRQ.createdAt,
        updatedAt: oldPRQ.updatedAt,
      }).save(),
    ])
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
