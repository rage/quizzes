import { PeerReview as QNPeerReview } from "./app-modules/models"

import { Any } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import {
  PeerReview,
  PeerReviewQuestion,
  PeerReviewQuestionAnswer,
  PeerReviewQuestionCollection,
  Quiz,
  QuizAnswer,
  QuizOptionAnswer,
  User,
} from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migratePeerReviews(users: { [username: string]: User }) {
  console.log("Querying peer reviews...")
  const peerReviews = await QNPeerReview.find({})

  const newPeerReviews: Array<QueryPartialEntity<PeerReview>> = []
  const newPeerReviewAnswers: Array<
    QueryPartialEntity<PeerReviewQuestionAnswer>
  > = []
  const bar = progressBar("Migrating peer reviews", peerReviews.length)
  await Promise.all(
    peerReviews.map(async (oldPR: any) => {
      const answer = await QuizAnswer.findOne(
        getUUIDByString(oldPR.chosenQuizAnswerId),
      )
      if (!answer) {
        return
      }

      const rejectedAnswer = await QuizAnswer.findOne(
        getUUIDByString(oldPR.rejectedQuizAnswerId),
      )

      const quizID = getUUIDByString(oldPR.quizId)
      const sourceQuizId = getUUIDByString(oldPR.sourceQuizId)
      const prqcFind = await PeerReviewQuestionCollection.find({
        take: 1,
        where: {
          id: Any([quizID, sourceQuizId]),
        },
      })
      if (!prqcFind) {
        return
      }

      const user = users[oldPR.giverAnswererId]
      if (!user) {
        return
      }

      const [pr, answers] = await migratePeerReview(
        user.id,
        answer,
        rejectedAnswer,
        await prqcFind[0].questions,
        oldPR,
      )
      newPeerReviews.push(pr)
      answers.forEach(newAnswer => newPeerReviewAnswers.push(newAnswer))
      bar.tick()
    }),
  )

  const prChunk = 16300
  for (let i = 0; i < newPeerReviews.length; i += prChunk) {
    await PeerReview.createQueryBuilder()
      .insert()
      .values(newPeerReviews.slice(i, i + prChunk))
      .onConflict(`("id") DO NOTHING`)
      .execute()
  }

  const praChunk = 32700
  for (let i = 0; i < newPeerReviewAnswers.length; i += prChunk) {
    await PeerReviewQuestionAnswer.createQueryBuilder()
      .insert()
      .values(newPeerReviewAnswers.slice(i, i + praChunk))
      .onConflict(`("peer_review_id", "peer_review_question_id") DO NOTHING`)
      .execute()
  }
}

function migratePeerReview(
  userId: number,
  quizAnswer: QuizAnswer,
  rejectedQuizAnswer: QuizAnswer,
  questions: PeerReviewQuestion[],
  oldPR: { [key: string]: any },
): [
  QueryPartialEntity<PeerReview>,
  Array<QueryPartialEntity<PeerReviewQuestionAnswer>>
] {
  const pr = {
    id: getUUIDByString(oldPR._id),
    userId,
    quizAnswerId: quizAnswer.id,
    rejectedQuizAnswers: Promise.resolve(
      rejectedQuizAnswer ? [rejectedQuizAnswer] : [],
    ),
    createdAt: quizAnswer.createdAt,
    updatedAt: quizAnswer.updatedAt,
  }

  const answers = []
  for (const question of questions) {
    const answer: QueryPartialEntity<PeerReviewQuestionAnswer> = {
      peerReviewId: pr.id,
      peerReviewQuestionId: question.id,
      createdAt: quizAnswer.createdAt,
      updatedAt: quizAnswer.updatedAt,
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
