import {
  PeerReview,
  PeerReviewQuestion,
  PeerReviewQuestionAnswer,
  PeerReviewCollection,
  User,
} from "./models"
import { PeerReview as QNPeerReview } from "./app-modules/models"

import { Any } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { calculateChunkSize, progressBar } from "./util"
import { getUUIDByString, insert } from "./util/"

import { logger } from "./config/winston"

export async function migratePeerReviews(
  users: { [username: string]: User },
  existingAnswers: { [answerID: string]: boolean },
  peerReviews: any[],
) {
  logger.info("Querying peer reviews...")
  /*const peerReviews = await QNPeerReview.find({
    $or: [
      { createdAt: { $gte: LAST_MIGRATION } },
      { updatedAt: { $gte: LAST_MIGRATION } },
    ],
  })*/

  const newPeerReviews: Array<QueryPartialEntity<PeerReview>> = []
  const newPeerReviewAnswers: Array<
    QueryPartialEntity<PeerReviewQuestionAnswer>
  > = []

  logger.info("Querying peer review question collections...")
  const prqcArray = await PeerReviewCollection.find()
  logger.info("Querying peer review question collection questions...")
  const prqcs: { [prqcID: string]: PeerReviewQuestion[] } = {}
  for (const prqc of prqcArray) {
    prqcs[prqc.id] = await prqc.questions
  }

  let bar = progressBar("Converting peer reviews", peerReviews.length)
  for (const oldPR of peerReviews) {
    const answerID = getUUIDByString(oldPR.chosenQuizAnswerId)
    if (!existingAnswers[answerID]) {
      continue
    }

    let rejectedAnswerID = getUUIDByString(oldPR.rejectedQuizAnswerId)
    if (!existingAnswers[rejectedAnswerID]) {
      rejectedAnswerID = undefined
    }

    const user = users[oldPR.giverAnswererId]
    /*if (!user) {
      continue
    }*/

    const quizID = getUUIDByString(oldPR.quizId)
    const sourceQuizID = getUUIDByString(oldPR.sourceQuizId)
    const questions = prqcs[quizID] || prqcs[sourceQuizID]
    if (!questions) {
      continue
    }

    const id = getUUIDByString(oldPR._id)
    newPeerReviews.push({
      id,
      userId: user ? user.id : null,
      quizAnswerId: answerID,
      rejectedQuizAnswerIds: rejectedAnswerID ? [rejectedAnswerID] : [],
      createdAt: oldPR.createdAt,
      updatedAt: oldPR.updatedAt,
    })

    for (const question of questions) {
      newPeerReviewAnswers.push({
        peerReviewId: id,
        peerReviewQuestionId: question.id,
        createdAt: oldPR.createdAt,
        updatedAt: oldPR.updatedAt,
        text: question.type === "essay" ? oldPR.review : null,
        value:
          question.type === "grade"
            ? oldPR.grading[question.texts[0].title]
            : null,
      })
    }
    bar.tick()
  }

  bar = progressBar("Inserting peer reviews", newPeerReviews.length)
  const prChunk = calculateChunkSize(newPeerReviews[0])
  for (let i = 0; i < newPeerReviews.length; i += prChunk) {
    const vals = newPeerReviews.slice(i, i + prChunk)
    await insert(PeerReview, vals)
    bar.tick(vals.length)
  }

  bar = progressBar(
    "Inserting peer review answers",
    newPeerReviewAnswers.length,
  )
  const praChunk = calculateChunkSize(newPeerReviewAnswers[0])
  for (let i = 0; i < newPeerReviewAnswers.length; i += praChunk) {
    const vals = newPeerReviewAnswers.slice(i, i + praChunk)
    await insert(
      PeerReviewQuestionAnswer,
      vals,
      `"peer_review_id", "peer_review_question_id"`,
    )
    bar.tick(vals.length)
  }
}
