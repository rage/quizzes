import { PeerReview as QNPeerReview } from "./app-modules/models"

import { Any } from "typeorm"
import {
  PeerReview,
  PeerReviewQuestionAnswer,
  PeerReviewQuestionCollection,
  Quiz,
  QuizAnswer,
  User,
} from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migratePeerReviews(users: { [username: string]: User }) {
  console.log("Querying peer reviews...")
  const peerReviews = await QNPeerReview.find({})

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

      await migratePeerReview(
        user.id,
        answer,
        rejectedAnswer,
        prqcFind[0],
        oldPR,
      )
      bar.tick()
    }),
  )
}

async function migratePeerReview(
  userId: number,
  quizAnswer: QuizAnswer,
  rejectedQuizAnswer: QuizAnswer,
  prqc: PeerReviewQuestionCollection,
  oldPR: { [key: string]: any },
): Promise<PeerReview> {
  const pr = await PeerReview.create({
    id: getUUIDByString(oldPR._id),
    userId,
    quizAnswerId: quizAnswer.id,
    rejectedQuizAnswers: Promise.resolve(
      rejectedQuizAnswer ? [rejectedQuizAnswer] : [],
    ),
    createdAt: quizAnswer.createdAt,
    updatedAt: quizAnswer.updatedAt,
  }).save()

  const answers = []
  for (const question of await prqc.questions) {
    const answer = PeerReviewQuestionAnswer.create({
      peerReviewId: pr.id,
      peerReviewQuestionId: question.id,
      createdAt: quizAnswer.createdAt,
      updatedAt: quizAnswer.updatedAt,
    })
    if (question.type === "essay") {
      answer.text = oldPR.review
    } else if (question.type === "grade") {
      answer.value = oldPR.grading[question.texts[0].title]
    }
    await answer.save()
    answers.push(answer)
  }
  pr.answers = Promise.resolve(answers)

  return pr
}
