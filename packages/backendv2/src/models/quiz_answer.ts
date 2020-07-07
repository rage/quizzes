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

  public static async getManualReview(
    quizId: string,
    page: number,
    pageSize: number,
  ) {
    const answers = (
      await this.query()
        .where("quiz_id", quizId)
        .andWhere("status", "manual-review")
        .orderBy("created_at")
        .page(page, pageSize)
    ).results
    for (const answer of answers) {
      delete answer.languageId
      answer.itemAnswers = await answer.$relatedQuery("itemAnswers")
      for (const itemAnswer of answer.itemAnswers) {
        itemAnswer.optionAnswers = await itemAnswer.$relatedQuery(
          "optionAnswers",
        )
      }
    }
    return answers
  }
}

export default QuizAnswer
