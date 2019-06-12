import {
  PeerReviewQuestion,
  PeerReviewCollection,
  PeerReviewCollectionTranslation,
  PeerReviewQuestionTranslation,
  Quiz,
  UserCourseState,
} from "./models"
import oldQuizTypes from "./app-modules/constants/quiz-types"
import {
  PeerReview as QNPeerReview,
  Quiz as QNQuiz,
} from "./app-modules/models"

import { logger } from "./config/winston"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { progressBar, safeGet } from "./util"
import { getUUIDByString, insert } from "./util/"

export async function migratePeerReviewQuestions(
  peerReviewQuestions: any[],
  peerReviews: any[],
) {
  /*logger.info"Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
    $or: [
      { createdAt: { $gte: LAST_MIGRATION } },
      { updatedAt: { $gte: LAST_MIGRATION } },
    ],
  })*/
  logger.info("peer reviews: ", peerReviewQuestions.length)
  const bar = progressBar(
    "Migrating peer review questions",
    peerReviewQuestions.length,
  )
  const collections: Array<QueryPartialEntity<PeerReviewCollection>> = []
  const collectionTranslations: Array<
    QueryPartialEntity<PeerReviewCollectionTranslation>
  > = []
  const questions: Array<QueryPartialEntity<PeerReviewQuestion>> = []
  const questionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionTranslation>
  > = []
  let quizNotFound = 0
  let answerNotFound = 0
  await Promise.all(
    peerReviewQuestions.map(async (oldPRQ: any, index: number) => {
      const quiz = await Quiz.createQueryBuilder("quiz")
        .leftJoinAndSelect("quiz.course", "course")
        .leftJoinAndSelect("course.languages", "language")
        .where("quiz.id = :id", {
          id: getUUIDByString(safeGet(() => oldPRQ.data.quizId)),
        })
        .getOne()

      if (!quiz) {
        quizNotFound++
        return
      }

      const val = await migratePeerReviewQuestion(quiz, oldPRQ, peerReviews)
      if (!val) {
        answerNotFound++
        return
      }

      const [prqc, prqct, prqs, prqts] = val
      collections.push(prqc)
      collectionTranslations.push(prqct)
      prqs.forEach(prq => questions.push(prq))
      prqts.forEach(prqt => questionTranslations.push(prqt))

      bar.tick()
    }),
  )

  logger.info(
    `${quizNotFound} peer review questions did not match any quiz and ` +
      `${answerNotFound} peer review questions did not have any answers.`,
  )

  logger.info("Inserting peer review questions")
  await insert(PeerReviewCollection, collections)
  await insert(
    PeerReviewCollectionTranslation,
    collectionTranslations,
    `"peer_review_collection_id", "language_id"`,
  )
  await insert(PeerReviewQuestion, questions)
  await insert(
    PeerReviewQuestionTranslation,
    questionTranslations,
    `"peer_review_question_id", "language_id"`,
  )
}

async function migratePeerReviewQuestion(
  quiz: Quiz,
  oldPRQ: { [key: string]: any },
  peerReviews: any[],
): Promise<
  [
    QueryPartialEntity<PeerReviewCollection>,
    QueryPartialEntity<PeerReviewCollectionTranslation>,
    Array<QueryPartialEntity<PeerReviewQuestion>>,
    Array<QueryPartialEntity<PeerReviewQuestionTranslation>>
  ]
> {
  const languageId = (await quiz.course).languages[0].id

  /*const peerReviewSample = await QNPeerReview.findOne({
    $or: [{ quizId: oldPRQ._id }, { sourceQuizId: oldPRQ._id }],
  })*/

  const peerReviewSample = peerReviews.find(
    pr => pr.quizId === oldPRQ._id || pr.sourceQuizId === oldPRQ._id,
  )

  if (!peerReviewSample) {
    return null
  }

  const collection = {
    id: getUUIDByString(oldPRQ._id),
    quizId: quiz.id,
    createdAt: oldPRQ.createdAt,
    updatedAt: oldPRQ.updatedAt,
  }
  const collectionTranslation = {
    peerReviewCollectionId: collection.id,
    languageId,
    title: oldPRQ.title || "",
    body: oldPRQ.body || "",
    createdAt: oldPRQ.createdAt,
    updatedAt: oldPRQ.updatedAt,
  }

  const questions: Array<QueryPartialEntity<PeerReviewQuestion>> = []
  const questionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionTranslation>
  > = []
  let order = 1
  const newPRQ = (
    id: string,
    type: string,
    title: string = "",
    body: string = "",
  ) => {
    questions.push({
      id: getUUIDByString(id),
      quizId: quiz.id,
      peerReviewCollectionId: collection.id,
      default: false,
      type,
      order: order++,
      answerRequired: oldPRQ.data.answeringRequired,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    })
    questionTranslations.push({
      peerReviewQuestionId: getUUIDByString(id),
      languageId,
      title,
      body,
      createdAt: oldPRQ.createdAt,
      updatedAt: oldPRQ.updatedAt,
    })
  }

  if (peerReviewSample.review && peerReviewSample.review !== "n/a") {
    newPRQ(oldPRQ._id + "essay", "essay")
  }
  if (peerReviewSample.grading) {
    for (const question of Object.keys(peerReviewSample.grading)) {
      newPRQ(oldPRQ._id + question, "grade", question)
    }
  }

  return [collection, collectionTranslation, questions, questionTranslations]
}
