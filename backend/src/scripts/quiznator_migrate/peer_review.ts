import { PeerReview as QNPeerReview } from "./app-modules/models"

import {
  PeerReview,
  PeerReviewQuestionAnswer,
  PeerReviewQuestionCollection,
  Quiz,
  QuizAnswer,
  User,
} from "../../models"
import { getUUIDByString, progressBar } from "./util"

export async function migratePeerReviews(
  users: { [username: string]: User },
  quizzes: { [quizID: string]: Quiz },
  peerReviewQuestions: { [prqID: string]: PeerReviewQuestionCollection },
  answers: { [answerID: string]: QuizAnswer },
): Promise<{ [prID: string]: PeerReview }> {
  console.log("Querying peer reviews...")
  const peerReviews = await QNPeerReview.find({})

  const newReviews: { [prID: string]: PeerReview } = {}
  const bar = progressBar("Migrating peer reviews", peerReviews.length)
  for (const oldPR of peerReviews) {
    const answer = answers[getUUIDByString(oldPR.chosenQuizAnswerId)]
    if (!answer) {
      continue
    }

    const rejectedAnswer = answers[getUUIDByString(oldPR.rejectedQuizAnswerId)]

    let quiz = quizzes[getUUIDByString(oldPR.quizId)]
    let prqc = peerReviewQuestions[getUUIDByString(oldPR.sourceQuizId)]
    if (!quiz) {
      quiz = quizzes[getUUIDByString(oldPR.sourceQuizId)]
      prqc = peerReviewQuestions[getUUIDByString(oldPR.quizId)]
    }
    if (!quiz) {
      continue
    }

    const user = users[oldPR.giverAnswererId]
    if (!user) {
      continue
    }

    try {
      const pr = await migratePeerReview(
        user,
        answer,
        rejectedAnswer,
        prqc,
        oldPR,
      )
      newReviews[pr.id] = pr
      bar.tick()
    } catch (e) {
      console.error("Failed to migrate peer review", oldPR)
      throw e
    }
  }
  return newReviews
}

async function migratePeerReview(
  user: User,
  quizAnswer: QuizAnswer,
  rejectedQuizAnswer: QuizAnswer,
  prqc: PeerReviewQuestionCollection,
  oldPR: { [key: string]: any },
): Promise<PeerReview> {
  const pr = await PeerReview.create({
    id: getUUIDByString(oldPR._id),
    user,
    quizAnswer,
    rejectedQuizAnswers: Promise.resolve(
      rejectedQuizAnswer ? [rejectedQuizAnswer] : [],
    ),
    createdAt: quizAnswer.createdAt,
    updatedAt: quizAnswer.updatedAt,
  }).save()

  const answers = []
  for (const question of await prqc.questions) {
    const answer = PeerReviewQuestionAnswer.create({
      peerReview: pr,
      peerReviewQuestion: question,
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
