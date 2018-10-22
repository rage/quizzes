import {
  Quiz,
  QuizTranslation,
  QuizItem,
  PeerReviewQuestion,
} from "@quizzes/common/models"
import { IQuizQuery, INewQuizQuery } from "@quizzes/common/types"
import { SelectQueryBuilder, InsertResult } from "typeorm"
import quizanswerService from "./quizanswer.service"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

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
    /*     const insertResult: InsertResult = await Quiz.createQueryBuilder()
      .insert()
      .into(Quiz)
      .values(query)
      .onConflict(`("id") DO NOTHING`)
      .execute() */

    return await Quiz.save(quiz).then(async (newQuiz: Quiz) => {
      if (newQuiz.texts) {
        await Promise.all(
          newQuiz.texts.map((text: QuizTranslation) => {
            text.quizId = newQuiz.id

            return text.save()
          }),
        )
      }

      if (newQuiz.items) {
        const items = await newQuiz.items
        await Promise.all(
          items.map((item: QuizItem) => {
            item.quizId = newQuiz.id

            return item.save()
          }),
        )
      }

      if (newQuiz.peerReviewQuestions) {
        const questions = await newQuiz.peerReviewQuestions
        await Promise.all(
          questions.map((question: PeerReviewQuestion) => {
            question.quizId = newQuiz.id

            return question.save()
          }),
        )
      }
      return newQuiz
    })
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
