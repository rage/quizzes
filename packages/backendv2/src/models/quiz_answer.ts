import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"

class QuizAnswer extends Model {
  id!: string
  quizId!: string
  languageId!: string
  itemAnswers!: QuizItemAnswer[]

  static get tableName() {
    return "quiz_answer"
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    itemAnswers: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
  }

  public static async getById(quizAnswerId: string) {
    const quizAnswer = await this.query().findById(quizAnswerId)
    await this.joinItemsAndOptions([quizAnswer])
    return quizAnswer
  }

  public static async getAnswersForManualReview(
    quizId: string,
    page: number,
    pageSize: number,
  ) {
    const quizAnswers = (
      await this.query()
        .where("quiz_id", quizId)
        .andWhere("status", "manual-review")
        .orderBy("created_at")
        .page(page, pageSize)
    ).results
    await this.joinItemsAndOptions(quizAnswers)
    return quizAnswers
  }

  private static async joinItemsAndOptions(quizAnswers: QuizAnswer[]) {
    for (const quizAnswer of quizAnswers) {
      delete quizAnswer.languageId
      quizAnswer.itemAnswers = await quizAnswer.$relatedQuery("itemAnswers")
      for (const itemAnswer of quizAnswer.itemAnswers) {
        itemAnswer.optionAnswers = await itemAnswer.$relatedQuery(
          "optionAnswers",
        )
      }
    }
  }
}

export default QuizAnswer
