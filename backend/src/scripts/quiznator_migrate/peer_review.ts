import { PeerReview as QNPeerReview } from "./app-modules/models"

import { Any } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  PeerReview,
  PeerReviewQuestion,
  PeerReviewQuestionAnswer,
  PeerReviewQuestionCollection,
  User,
} from "../../models"
import { getUUIDByString, insert, progressBar } from "./util"

export async function migratePeerReviews(
  users: { [username: string]: User },
  existingAnswers: { [answerID: string]: boolean },
) {
  console.log("Querying peer reviews...")
  const peerReviews = await QNPeerReview.find({})

  const newPeerReviews: Array<QueryPartialEntity<PeerReview>> = []
  const newPeerReviewAnswers: Array<
    QueryPartialEntity<PeerReviewQuestionAnswer>
  > = []

  console.log("Querying peer review question collections...")
  const prqcArray = await PeerReviewQuestionCollection.find()
  console.log("Querying peer review question collection questions...")
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
    if (!user) {
      continue
    }

    const quizID = getUUIDByString(oldPR.quizId)
    const sourceQuizID = getUUIDByString(oldPR.sourceQuizId)
    const questions = prqcs[quizID] || prqcs[sourceQuizID]
    if (!questions) {
      continue
    }

    const id = getUUIDByString(oldPR._id)
    newPeerReviews.push({
      id,
      userId: user.id,
      quizAnswerId: answerID,
      rejectedQuizAnswerIds: rejectedAnswerID ? [rejectedAnswerID] : [],
      createdAt: oldPR.createdAt,
      updatedAt: oldPR.updatedAt,
    })

    for (const question of questions) {
      const answer: QueryPartialEntity<PeerReviewQuestionAnswer> = {
        peerReviewId: id,
        peerReviewQuestionId: question.id,
        createdAt: oldPR.createdAt,
        updatedAt: oldPR.updatedAt,
      }
      if (question.type === "essay") {
        answer.text = oldPR.review
      } else if (question.type === "grade") {
        answer.value = oldPR.grading[question.texts[0].title]
      }
      newPeerReviewAnswers.push(answer)
    }
    bar.tick()
  }

  bar = progressBar("Inserting peer reviews", newPeerReviews.length)
  const prChunk = 10900
  for (let i = 0; i < newPeerReviews.length; i += prChunk) {
    const vals = newPeerReviews.slice(i, i + prChunk)
    await insert(PeerReview, vals)
    bar.tick(vals.length)
  }

  bar = progressBar(
    "Inserting peer review answers",
    newPeerReviewAnswers.length,
  )
  const praChunk = 10900
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
