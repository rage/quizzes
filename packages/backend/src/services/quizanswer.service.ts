import { QuizAnswer, QuizItemAnswer } from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { QuizService } from "./quiz.service"

@Service()
export class QuizAnswerService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizService: QuizService

  public async createQuizAnswer(quizAnswer: any) {
    const quiz = await this.quizService.getQuizzes({
      id: quizAnswer.quizId,
      items: true,
      options: true,
    })
    const items = quiz[0].items
    console.log(items[0].texts)
    let points = 0
    const itemAnswerStatus = items.map(item => {
      const itemAnswer = quizAnswer.itemAnswers.find(
        (ia: any) => ia.quizItemId === item.id,
      )
      const itemTranslation = item.texts.find(
        text => (text.languageId = quizAnswer.languageId),
      )
      let statusObject
      let correct = false
      if (item.type === "open") {
        const validator = new RegExp(item.validityRegex)
        if (validator.test(itemAnswer.textData)) {
          points++
          correct = true
        }
        statusObject = {
          correct,
          message: correct
            ? itemTranslation.successMessage
            : itemTranslation.failureMessage,
        }
      }
      if (item.type === "radio") {
        const options = item.options.map(option => {
          const optionTranslation = option.texts.find(
            text => text.languageId === quizAnswer.languageId,
          )
        })
      }
      return statusObject
    })
    const normalizedPoints = points / items.length
    console.log(points, normalizedPoints)
    console.log(itemAnswerStatus)
    /*let answer: QuizAnswer | undefined

    await this.entityManager.transaction(async entityManager => {
      answer = await entityManager.save(quizAnswer)
    })*/

    return ""
  }

  /*public async getAnswers(query: IQuizAnswerQuery): Promise<QuizAnswer[]> {
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
      "quiz_answer.itemanswers",
      "quiz_item_answer",
      "quiz_item_answer.quiz_answer_id = quiz_answer.id",
    )

    queryBuilder.leftJoinAndSelect(
      "quiz_item_answer.options",
      "quiz_option_answer",
      "quiz_option_answer.quiz_item_answer_id = quiz_item_answer.id",
    )

    return await queryBuilder.getMany()
  }*/
}

export default { QuizAnswerService }
