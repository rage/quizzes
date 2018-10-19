import { Quiz } from "@quizzes/common/models"
import { IQuizQuery } from "@quizzes/common/types"
import { SelectQueryBuilder } from "typeorm"

export class QuizService {
  public static getInstance(): QuizService {
    if (!this.instance) {
      this.instance = new this()
    }

    return this.instance
  }

  private static instance: QuizService

  public async getQuizzes(query: IQuizQuery): Promise<Quiz[]> {
    const { id, course, language, items, options, peerreviews } = query

    const queryBuilder: SelectQueryBuilder<Quiz> = Quiz.createQueryBuilder(
      "quiz",
    )

    if (id) {
      queryBuilder.where("quiz.id = :id", { id })
    }

    if (course) {
      queryBuilder.leftJoinAndSelect("quiz.course", "course")

      if (language) {
        queryBuilder
          .leftJoinAndSelect("course.languages", "language")
          .where("language.id = :language", { language })
      }
    }

    if (language) {
      queryBuilder
        .leftJoinAndSelect("quiz.texts", "quiz_translation")
        .where("quiz_translation.language_id = :language", { language })
    }

    if (items) {
      queryBuilder.leftJoinAndSelect("quiz.items", "quiz_item")

      if (language) {
        queryBuilder.leftJoinAndSelect(
          "quiz_item.texts",
          "quiz_item_translation",
          "quiz_item_translation.language_id = :language",
          { language },
        )
      }
    }

    if (items && options) {
      queryBuilder.leftJoinAndSelect("quiz_item.options", "quiz_option")

      if (language) {
        queryBuilder.leftJoinAndSelect(
          "quiz_option.texts",
          "quiz_option_translation",
          "quiz_option_translation.language_id = :language",
          { language },
        )
      }
    }

    if (peerreviews) {
      queryBuilder.leftJoinAndSelect(
        "quiz.peerReviewQuestions",
        "peer_review_question",
      )

      if (language) {
        queryBuilder.leftJoinAndSelect(
          "peer_review_question.texts",
          "peer_review-question_translation",
          "peer_review_question_Translation.language_id = :language",
          { language },
        )
      }
    }

    return await queryBuilder.getMany()
  }

  public async createQuiz(quiz: Quiz): Promise<Quiz> {
    return await Quiz.create(quiz)
  }

  public async updateQuiz(quiz: Quiz): Promise<Quiz> {
    return await Quiz.save(quiz)
  }

  public async deleteQuiz(id: string): Promise<boolean> {
    try {
      await Quiz.delete({ id })

      return true
    } catch {
      return false
    }
  }
}

export default { QuizService }
