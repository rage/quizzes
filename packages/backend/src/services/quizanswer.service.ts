import {
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
  UserQuizState,
} from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import QuizService from "./quiz.service"

@Service()
export default class QuizAnswerService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizService: QuizService

  public async createQuizAnswer(quizAnswer: any) {
    let answer: QuizAnswer | undefined

    await this.entityManager.transaction(async entityManager => {
      answer = await entityManager.save(quizAnswer)
    })

    return answer
  }

  public async checkForDeprecated(quizAnswer: QuizAnswer) {
    const answers: QuizAnswer[] = await this.entityManager
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
          this.entityManager.save(answer)
        }
      }),
    )
  }

  public async validateQuizAnswer(
    quizAnswer: QuizAnswer,
    quiz: Quiz,
    userState: UserQuizState,
  ) {
    const userQuizState = userState || new UserQuizState()
    const items: QuizItem[] = quiz.items
    let points: number | null = null
    let normalizedPoints
    const itemAnswerStatus = items.map(item => {
      const itemAnswer = quizAnswer.itemAnswers.find(
        (ia: QuizItemAnswer) => ia.quizItemId === item.id,
      )
      const itemTranslation = item.texts.find(
        text => text.languageId === quizAnswer.languageId,
      )
      let itemStatusObject: any
      let correct = false

      switch (item.type) {
        case "essay":
          quizAnswer.status = "submitted"
          userQuizState.peerReviewsReceived = 0
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
        case "radio":
          const optionAnswerStatus = item.options.map(option => {
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
      }

      itemStatusObject.itemId = item.id
      itemAnswer.correct = correct

      return itemStatusObject
    })

    normalizedPoints = points != null ? points / items.length : null
    console.log("tries", userQuizState.tries)
    quizAnswer.status = points === null ? quizAnswer.status : "confirmed"

    userQuizState.userId = quizAnswer.userId
    userQuizState.quizId = quizAnswer.quizId
    userQuizState.points =
      userQuizState.points > points ? userQuizState.points : points
    userQuizState.normalizedPoints =
      userQuizState.normalizedPoints > normalizedPoints
        ? userQuizState.normalizedPoints
        : normalizedPoints
    userQuizState.tries = userQuizState.tries ? userQuizState.tries + 1 : 1
    userQuizState.status = "locked"

    /*itemAnswerStatus.map(ias => {
      console.log(ias)
    })*/

    const response = {
      itemAnswerStatus,
    }

    return { response, quizAnswer, userQuizState }
  }

  public async getAnswers(query: IQuizAnswerQuery): Promise<QuizAnswer[]> {
    const { id, quiz_id, user_id } = query

    const queryBuilder: SelectQueryBuilder<
      QuizAnswer
    > = QuizAnswer.createQueryBuilder("quiz_answer")

    if (!id && !quiz_id && !user_id) {
      return []
    }

    if (id) {
      queryBuilder.where("quiz_answer.id = :id", { id })
    }

    if (quiz_id) {
      queryBuilder.where("quiz_answer.quiz_id = :quiz_id", { quiz_id })
    }

    if (user_id) {
      queryBuilder.where("quiz_answer.user_id = :user_id", { user_id })
    }

    queryBuilder.leftJoinAndSelect(
      "quiz_answer.item_answers",
      "quiz_item_answer",
      "quiz_item_answer.quiz_answer_id = quiz_answer.id",
    )

    queryBuilder.leftJoinAndSelect(
      "quiz_item_answer.options",
      "quiz_option_answer",
      "quiz_option_answer.quiz_item_answer_id = quiz_item_answer.id",
    )

    return await queryBuilder.getMany()
  }
}
