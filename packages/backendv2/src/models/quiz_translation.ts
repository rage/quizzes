import Model from "./base_model"
import Quiz from "./quiz"

class QuizTranslation extends Model {
  quizId!: string
  languageId!: string
  title!: string
  body!: string
  submitMessage!: string

  static get tableName() {
    return "quiz_translation"
  }

  static get idColumn() {
    return ["quiz_id", "language_id"]
  }

  static relationMappings = {
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: Quiz,
      join: {
        from: "quiz_translation.quiz_id",
        to: "quiz.id",
      },
    },
  }

  static get modifiers() {
    return {
      previewSelect: (query: any) => {
        query.select("title", "body")
      },
    }
  }
}

export default QuizTranslation
