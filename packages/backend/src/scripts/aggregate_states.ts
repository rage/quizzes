import { Database } from "@quizzes/common/config/database"
import {
  PeerReview,
  Quiz,
  QuizAnswer,
  QuizItem,
  SpamFlag,
  UserQuizState,
} from "@quizzes/common/models"
import { Container } from "typedi"
import { EntityManager, getManager } from "typeorm"

const database = Container.get(Database)

database.connect().then(() => createUserQuizStates())

const createUserQuizStates = async () => {
  console.time()
  const manager: EntityManager = getManager()
  const quizAnswers: QuizAnswer[] = await manager
    .createQueryBuilder(QuizAnswer, "quiz_answer")
    .getMany()
  const quizzes: Quiz[] = await manager
    .createQueryBuilder(Quiz, "quiz")
    .leftJoinAndSelect("quiz.items", "item")
    .addSelect("item.validityRegex")
    .leftJoinAndSelect("item.options", "option")
    .addSelect("option.correct")
    .leftJoinAndSelect(
      "quiz.peerReviewQuestionCollections",
      "peer_review_question_collection",
    )
    .leftJoinAndSelect(
      "peer_review_question_collection.questions",
      "peer_review_question",
    )
    .getMany()
  const peerReviews: PeerReview[] = await manager
    .createQueryBuilder(PeerReview, "peer_review")
    .getMany()
  const spamFlags: SpamFlag[] = await manager
    .createQueryBuilder(SpamFlag, "spam_flag")
    .getMany()
  const userQuizStates: UserQuizState[] = []
  const updatedQuizAnswers: QuizAnswer[] = []
  quizAnswers.map((quizAnswer, index) => {
    console.log(index + 1, "/", quizAnswers.length)
    const quiz: Quiz = quizzes.find(q => q.id === quizAnswer.quizId)
    let userQuizState: UserQuizState = userQuizStates.find(
      uqs => uqs.userId === quizAnswer.userId && uqs.quizId === quiz.id,
    )
    if (!userQuizState) {
      userQuizState = new UserQuizState()
      userQuizState.quizId = quiz.id
      userQuizState.userId = quizAnswer.userId
      userQuizState.status = "locked"
      userQuizStates.push(userQuizState)
    }
    userQuizState.tries += 1
    const status = quizAnswer.status
    if (status === "deprecated") {
      return
    }
    let correct = 0
    quizAnswer.itemAnswers.map(itemAnswer => {
      const quizItem: QuizItem = quiz.items.find(
        item => item.id === itemAnswer.quizItemId,
      )
      switch (quizItem.type) {
        case "essay":
          const flagged = spamFlags.filter(
            sf => sf.quizAnswerId === quizAnswer.id,
          )
          const reviewsReceived = peerReviews.filter(
            pr => pr.quizAnswerId === quizAnswer.id,
          )
          const reviewsGiven = peerReviews.filter(
            pr =>
              pr.userId === quizAnswer.userId &&
              quizAnswers.find(qa => qa.id === pr.quizAnswerId).quizId ===
                quiz.id,
          )
          userQuizState.spamFlags = flagged.length
          userQuizState.peerReviewsReceived = reviewsReceived.length
          userQuizState.peerReviewsGiven = reviewsGiven.length
          if (status === "confirmed") {
            userQuizState.pointsAwarded = 1
          } else if (status === "spam" || "rejected") {
            userQuizState.status = "open"
          } else if (status === "submitted") {
            if (userQuizState.spamFlags > 3) {
              quizAnswer.status = "spam"
              userQuizState.status = "open"
              updatedQuizAnswers.push(quizAnswer)
            } else if (
              userQuizState.peerReviewsReceived >= 2 &&
              userQuizState.peerReviewsGiven >= 3
            ) {
              const total =
                quiz.peerReviewQuestionCollections[0].questions.filter(
                  prq => prq.type === "grade",
                ).length * reviewsReceived.length
              let negative = 0
              reviewsReceived.map(review => {
                negative += review.answers.filter(answer => answer.value === 1)
                  .length
              })
              if (negative / total <= 0.35) {
                quizAnswer.status = "confirmed"
                userQuizState.pointsAwarded = 1
                updatedQuizAnswers.push(quizAnswer)
              } else {
                quizAnswer.status = "rejected"
                userQuizState.status = "open"
                updatedQuizAnswers.push(quizAnswer)
              }
            }
          }
          break
        case "open":
          const validator = new RegExp(quizItem.validityRegex)
          if (validator.test(itemAnswer.textData)) {
            correct += 1
          }
          break
        case "radio":
          itemAnswer.optionAnswers.map(oa => {
            if (
              quiz.items
                .find(item => item.id === itemAnswer.quizItemId)
                .options.find(option => option.id === oa.quizOptionId).correct
            ) {
              correct += 1
              return
            }
          })
          break
        case "checkbox":
          break
        default:
      }
    })
    userQuizState.pointsAwarded = correct / quizAnswer.itemAnswers.length
  })
  console.log(userQuizStates.length)
  console.log(updatedQuizAnswers.length)
  await manager.insert(UserQuizState, userQuizStates)
  console.log("answers iserted")
  await Promise.all(
    updatedQuizAnswers.map(async updated => {
      await manager.save(QuizAnswer, updated)
    }),
  )
  console.log("updated answers: ", updatedQuizAnswers.length)
  console.timeEnd()
}
