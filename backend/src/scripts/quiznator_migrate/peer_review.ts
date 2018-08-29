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
import { getUUIDByString, progressBar } from "./util"

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
  console.log("Preparing to convert peer reviews...")

  const bar = progressBar("Converting peer reviews", peerReviews.length)
  await Promise.all(
    peerReviews.map(async (oldPR: any) => {
      const answerID = getUUIDByString(oldPR.chosenQuizAnswerId)
      if (!existingAnswers[answerID]) {
        return
      }

      let rejectedAnswerID = getUUIDByString(oldPR.rejectedQuizAnswerId)
      if (!existingAnswers[rejectedAnswerID]) {
        rejectedAnswerID = undefined
      }

      const quizID = getUUIDByString(oldPR.quizId)
      const sourceQuizID = getUUIDByString(oldPR.sourceQuizId)
      const prqcFind = await PeerReviewQuestionCollection.find({
        take: 1,
        where: {
          id: Any([quizID, sourceQuizID]),
        },
      })
      if (!prqcFind || prqcFind.length === 0) {
        return
      }

      const user = users[oldPR.giverAnswererId]
      if (!user) {
        return
      }

      const [pr, answers] = await migratePeerReview(
        user.id,
        answerID,
        rejectedAnswerID,
        await prqcFind[0].questions,
        oldPR,
      )
      newPeerReviews.push(pr)
      answers.forEach(newAnswer => newPeerReviewAnswers.push(newAnswer))
      bar.tick()
    }),
  )

  console.log("Inserting peer reviews...")
  const prChunk = 10900
  for (let i = 0; i < newPeerReviews.length; i += prChunk) {
    await PeerReview.createQueryBuilder()
      .insert()
      .values(newPeerReviews.slice(i, i + prChunk))
      .onConflict(`("id") DO NOTHING`)
      .execute()
  }

  const praChunk = 10900
  for (let i = 0; i < newPeerReviewAnswers.length; i += praChunk) {
    await PeerReviewQuestionAnswer.createQueryBuilder()
      .insert()
      .values(newPeerReviewAnswers.slice(i, i + praChunk))
      .onConflict(`("peer_review_id", "peer_review_question_id") DO NOTHING`)
      .execute()
  }
}

function migratePeerReview(
  userId: number,
  quizAnswerID: string,
  rejectedQuizAnswerID: string,
  questions: PeerReviewQuestion[],
  oldPR: { [key: string]: any },
): [
  QueryPartialEntity<PeerReview>,
  Array<QueryPartialEntity<PeerReviewQuestionAnswer>>
] {
  const pr = {
    id: getUUIDByString(oldPR._id),
    userId,
    quizAnswerId: quizAnswerID,
    rejectedQuizAnswerIds: rejectedQuizAnswerID ? [rejectedQuizAnswerID] : [],
    createdAt: oldPR.createdAt,
    updatedAt: oldPR.updatedAt,
  }

  const answers = []
  for (const question of questions) {
    const answer: QueryPartialEntity<PeerReviewQuestionAnswer> = {
      peerReviewId: pr.id,
      peerReviewQuestionId: question.id,
      createdAt: oldPR.createdAt,
      updatedAt: oldPR.updatedAt,
    }
    if (question.type === "essay") {
      answer.text = oldPR.review
    } else if (question.type === "grade") {
      answer.value = oldPR.grading[question.texts[0].title]
    }
    answers.push(answer)
  }
  return [pr, answers]
}
