import {
  PeerReviewQuestion,
  PeerReviewQuestionCollection,
  PeerReviewQuestionCollectionTranslation,
  PeerReviewQuestionTranslation,
  Quiz,
  UserCourseState,
} from "@quizzes/common/models"
import oldQuizTypes from "./app-modules/constants/quiz-types"
import {
  PeerReview as QNPeerReview,
  Quiz as QNQuiz,
} from "./app-modules/models"

import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { progressBar, safeGet } from "./util"
import { getUUIDByString, insert } from "@quizzes/common/util"

export async function migratePeerReviewQuestions() {
  console.log("Querying peer review questions...")
  const peerReviewQuestions = await QNQuiz.find({
    type: { $in: [oldQuizTypes.PEER_REVIEW] },
  })

  const bar = progressBar(
    "Migrating peer review questions",
    peerReviewQuestions.length,
  )
  const collections: Array<
    QueryPartialEntity<PeerReviewQuestionCollection>
  > = []
  const collectionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionCollectionTranslation>
  > = []
  const questions: Array<QueryPartialEntity<PeerReviewQuestion>> = []
  const questionTranslations: Array<
    QueryPartialEntity<PeerReviewQuestionTranslation>
  > = []
  let quizNotFound = 0
  let answerNotFound = 0
  await Promise.all(
    peerReviewQuestions.map(async (oldPRQ: any) => {
      const quiz = await Quiz.findOne(
        getUUIDByString(safeGet(() => oldPRQ.data.quizId)),
      )
      if (!quiz) {
        quizNotFound++
        return
      }

      const val = await migratePeerReviewQuestion(quiz, oldPRQ)
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

  console.log(
    `${quizNotFound} peer review questions did not match any quiz and ` +
      `${answerNotFound} peer review questions did not have any answers.`,
  )

  console.log("Inserting peer review questions")
  await insert(PeerReviewQuestionCollection, collections)
  await insert(
    PeerReviewQuestionCollectionTranslation,
    collectionTranslations,
    `"peer_review_question_collection_id", "language_id"`,
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
): Promise<
  [
    QueryPartialEntity<PeerReviewQuestionCollection>,
    QueryPartialEntity<PeerReviewQuestionCollectionTranslation>,
    Array<QueryPartialEntity<PeerReviewQuestion>>,
    Array<QueryPartialEntity<PeerReviewQuestionTranslation>>
  ]
> {
  const languageId = (await quiz.course).languages[0].id

  const peerReviewSample = await QNPeerReview.findOne({
    $or: [{ quizId: oldPRQ._id }, { sourceQuizId: oldPRQ._id }],
  })
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
    peerReviewQuestionCollectionId: collection.id,
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
      collectionId: collection.id,
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
