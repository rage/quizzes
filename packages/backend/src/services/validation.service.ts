import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  Course,
  PeerReview,
  PeerReviewQuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
  UserQuizState,
} from "../models"
import PeerReviewService from "./peerreview.service"
import { wordCount } from "./../../../common/src/util"

@Service()
export default class ValidationService {
  @Inject()
  private peerReviewService: PeerReviewService

  public validateQuizAnswer(
    quizAnswer: QuizAnswer,
    quiz: Quiz,
    userState: UserQuizState,
  ) {
    const userQuizState = userState || new UserQuizState()
    const items: QuizItem[] = quiz.items
    let points: number | null = null
    let pointsAwarded
    const itemAnswerStatus = items.map(item => {
      const itemAnswer = quizAnswer.itemAnswers.find(
        (ia: QuizItemAnswer) => ia.quizItemId === item.id,
      )
      const itemTranslation = item.texts.find(
        text => text.languageId === quizAnswer.languageId,
      )
      let itemStatusObject: any
      let optionAnswerStatus
      let correct = false

      switch (item.type) {
        case "essay":
          if (item.minWords && wordCount(itemAnswer.textData) < item.minWords) {
            itemStatusObject = {
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
          itemStatusObject = {
            value: itemAnswer.intData,
          }
          points += 1
          break
        case "feedback":
          points += 1
        case "checkbox":
        case "research-agreement":
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
      }

      itemStatusObject.itemId = item.id
      itemAnswer.correct = correct

      return itemStatusObject
    })

    pointsAwarded =
      points != null ? (points / items.length) * quiz.points : null
    quizAnswer.status = quizAnswer.status || "confirmed"

    userQuizState.userId = quizAnswer.userId
    userQuizState.quizId = quizAnswer.quizId
    userQuizState.pointsAwarded =
      userQuizState.pointsAwarded > pointsAwarded
        ? userQuizState.pointsAwarded
        : pointsAwarded
    userQuizState.tries = userQuizState.tries ? userQuizState.tries + 1 : 1
    userQuizState.status = "locked"

    const response = {
      itemAnswerStatus,
    }

    return { response, quizAnswer, userQuizState }
  }

  public async validateEssayAnswer(
    manager: EntityManager,
    quiz: Quiz,
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
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
      const peerReviews = await this.peerReviewService.getPeerReviews(
        manager,
        quizAnswer.id,
      )
      const answers: number[] = [].concat(
        ...peerReviews.map(pr => pr.answers.map(a => a.value)),
      )
      const sum: number = answers.reduce((prev, curr) => prev + curr)
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

  public async validateModificationOfExistingQuiz(quiz: Quiz, oldQuiz: Quiz) {
    const stricter = oldQuiz.items.some(qi => {
      if (qi.type !== "essay") {
        return false
      }
      const qi2 = quiz.items.find(x => x.id === qi.id)
      if (qi2 === null) {
        return false
      }
      if (qi2.minWords && (!qi.minWords || qi.minWords < qi2.minWords)) {
        return true
      }
      if (qi2.maxWords && (!qi.maxWords || qi.maxWords > qi2.maxWords)) {
        return true
      }
      return false
    })

    return stricter ? { error: "new quiz contains stricter quiz item" } : {}
  }
}
