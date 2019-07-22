import { Service } from "typedi"
import { EntityManager } from "typeorm"
import {
  Course,
  PeerReview,
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
  UserQuizState,
} from "../models"
import { wordCount } from "./../../../common/src/util"

interface ItemStatusObject {
  type?: string
  error?: string
  data?: {
    text?: string
    words?: number
    answerValue?: number
  }
  min?: number
  max?: number
  message?: string
  correctAnswer?: boolean
  submittedAnswer?: string
  correct?: boolean
  options?: any[]
  itemId?: string
  value?: number
}

@Service()
export default class ValidationService {
  public validateQuizAnswer(
    quizAnswer: QuizAnswer,
    quiz: Quiz,
    userQuizState: UserQuizState,
  ) {
    const items: QuizItem[] = quiz.items
    let points: number | null = null
    let pointsAwarded: number | null
    const itemAnswerStatus = items.map(item => {
      const itemAnswer = quizAnswer.itemAnswers.find(
        (ia: QuizItemAnswer) => ia.quizItemId === item.id,
      )

      if (!itemAnswer) {
        // throw new BadRequestError("All items need an answer")
        return
      }

      const itemTranslation = item.texts.find(
        text => text.languageId === quizAnswer.languageId,
      )
      let itemStatusObject: ItemStatusObject
      let optionAnswerStatus
      let correct = false

      switch (item.type) {
        case "essay":
          if (item.minWords && wordCount(itemAnswer.textData) < item.minWords) {
            itemStatusObject = {
              type: "essay",
              error: "Too short an answer",
              data: {
                text: itemAnswer.textData,
                words: wordCount(itemAnswer.textData),
              },
              min: item.minWords,
              max: item.maxWords,
            }
            break
          }
          if (item.maxWords && wordCount(itemAnswer.textData) > item.maxWords) {
            itemStatusObject = {
              type: "essay",
              error: "Too long an answer",
              data: {
                text: itemAnswer.textData,
                words: wordCount(itemAnswer.textData),
              },
              min: item.minWords,
              max: item.maxWords,
            }
            break
          }
          quizAnswer.status = "submitted"
          userQuizState.peerReviewsReceived = 0
          userQuizState.peerReviewsGiven = userQuizState.peerReviewsGiven || 0
          userQuizState.spamFlags = 0
          itemStatusObject = {}
          break
        case "open":
          const validator = new RegExp(item.validityRegex)
          if (validator.test(itemAnswer.textData)) {
            points += 1
            correct = true
          }
          itemStatusObject = {
            correct,
            submittedAnswer: itemAnswer.textData,
            message: correct
              ? itemTranslation.successMessage
              : itemTranslation.failureMessage,
          }
          break
        case "multiple-choice":
          optionAnswerStatus = item.options.map(option => {
            const optionAnswer = itemAnswer.optionAnswers.find(
              (oa: any) => oa.quizOptionId === option.id,
            )
            const optionTranslation = option.texts.find(
              text => text.languageId === quizAnswer.languageId,
            )
            return {
              optionId: option.id,
              selected: optionAnswer ? true : false,
              correctAnswer: option.correct,
              message:
                optionAnswer && option.correct
                  ? optionTranslation.successMessage
                  : optionTranslation.failureMessage,
            }
          })
          if (
            item.multi &&
            optionAnswerStatus.filter(oas => oas.selected !== oas.correctAnswer)
              .length === 0
          ) {
            correct = true
            points += 1
          } else if (
            !item.multi &&
            optionAnswerStatus.some(oas => oas.selected && oas.correctAnswer)
          ) {
            correct = true
            points += 1
          }
          itemStatusObject = {
            correct,
            message: correct
              ? itemTranslation.successMessage
              : itemTranslation.failureMessage,
            options: optionAnswerStatus,
          }
          break
        case "scale":
          const minimum = item.minValue ? item.minValue : 1
          const maximum = item.maxValue ? item.maxValue : 7
          if (itemAnswer.intData < minimum || itemAnswer.intData > maximum) {
            itemStatusObject = {
              type: "scale",
              error: "Scale value out of bounds",
              data: {
                answerValue: itemAnswer.intData,
              },
              min: minimum,
              max: maximum,
            }
            break
          }

          itemStatusObject = {
            value: itemAnswer.intData,
          }
          points += 1
          break
        case "feedback":
          points += 1
        case "checkbox":
        case "research-agreement":
          points += 1
          optionAnswerStatus = item.options.map(option => {
            const optionAnswer = itemAnswer.optionAnswers.find(
              (oa: any) => oa.quizOptionId === option.id,
            )
            return {
              optionId: option.id,
              selected: optionAnswer ? true : false,
            }
          })
          itemStatusObject = {
            options: optionAnswerStatus,
          }
          break
        case "custom-frontend-accept-data":
          if (itemAnswer.correct) {
            correct = true
            userQuizState.pointsAwarded = 1 * quiz.points
          }
          itemStatusObject = {}
          break
      }

      itemStatusObject.itemId = item.id
      itemAnswer.correct = correct

      return itemStatusObject
    })

    pointsAwarded =
      points !== null ? (points / items.length) * quiz.points : null

    userQuizState.userId = quizAnswer.userId
    userQuizState.quizId = quizAnswer.quizId
    userQuizState.tries = userQuizState.tries ? userQuizState.tries + 1 : 1

    const noTriesLeft = quiz.triesLimited && userQuizState.tries >= quiz.tries

    if (!quizAnswer.status) {
      quizAnswer.status = noTriesLeft ? "confirmed" : "submitted"
    }

    userQuizState.status = noTriesLeft ? "locked" : "open"

    if (quiz.peerReviewCollections.length > 0) {
      userQuizState.status = "locked"
    }

    if (quiz.autoConfirm) {
      quizAnswer.status = "confirmed"
      userQuizState.pointsAwarded = quiz.points
    } else if (userQuizState.pointsAwarded < pointsAwarded) {
      userQuizState.pointsAwarded = pointsAwarded
    }

    userQuizState.pointsAwarded =
      userQuizState.pointsAwarded > pointsAwarded
        ? userQuizState.pointsAwarded
        : pointsAwarded

    const response = {
      itemAnswerStatus,
    }

    return { response, quizAnswer, userQuizState }
  }

  public async validateEssayAnswer(
    quiz: Quiz,
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    peerReviews: PeerReview[] = [],
  ) {
    const course: Course = quiz.course
    const given: number = userQuizState.peerReviewsGiven
    const received: number = userQuizState.peerReviewsReceived
    if (
      quizAnswer.status === "submitted" &&
      userQuizState.spamFlags > course.maxSpamFlags
    ) {
      quizAnswer.status = "spam"
      userQuizState.spamFlags = null
      userQuizState.status = "open"
    } else if (
      quizAnswer.status === "submitted" &&
      given >= course.minPeerReviewsGiven &&
      received >= course.minPeerReviewsReceived
    ) {
      const answers: number[] = [].concat(
        ...peerReviews.map(pr => pr.answers.map(a => a.value)),
      )
      const sum: number = answers.reduce((prev, curr) => prev + curr, 0)
      if (sum / answers.length >= course.minReviewAverage) {
        quizAnswer.status = "confirmed"
        userQuizState.pointsAwarded = 1 * quiz.points
      } else {
        quizAnswer.status = "rejected"
        userQuizState.pointsAwarded = 0
        userQuizState.status = "open"
      }
    }
    return { quizAnswer, userQuizState }
  }

  public async checkForDeprecated(
    manager: EntityManager,
    quizAnswer: QuizAnswer,
  ) {
    const answers: QuizAnswer[] = await manager
      .createQueryBuilder(QuizAnswer, "quizAnswer")
      .where("user_id = :userId and quiz_id = :quizId", {
        userId: quizAnswer.userId,
        quizId: quizAnswer.quizId,
      })
      .getMany()
    await Promise.all(
      answers.map(async (answer: QuizAnswer) => {
        if (answer.status !== "deprecated") {
          answer.status = "deprecated"
          manager.save(answer)
        }
      }),
    )
  }
}
