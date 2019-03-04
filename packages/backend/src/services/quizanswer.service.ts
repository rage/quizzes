import {
  Quiz,
  QuizAnswer,
  QuizItem,
  QuizItemAnswer,
  UserQuizState,
} from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { WhereBuilder } from "@quizzes/common/util/index"
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

  public async createQuizAnswer(
    manager: EntityManager,
    quizAnswer: QuizAnswer,
  ) {
    if (!quizAnswer) {
      return
    }
    return manager.save(quizAnswer)
  }

  public async getAnswer(
    query: IQuizAnswerQuery,
    manager: EntityManager,
  ): Promise<QuizAnswer> {
    const { id, userId, quizId, status } = query
    const queryBuilder = manager.createQueryBuilder(QuizAnswer, "quiz_answer")
    const whereBuilder: WhereBuilder<QuizAnswer> = new WhereBuilder(
      queryBuilder,
    )

    if (id) {
      whereBuilder.add("quiz_answer.id = :id", { id })
    }

    if (userId) {
      whereBuilder.add("quiz_answer.user_id = :userId", { userId })
    }

    if (quizId) {
      whereBuilder.add("quiz_answer.quiz_id = :quizId", { quizId })
    }

    if (status) {
      whereBuilder.add("quiz_answer.status = :status", { status })
    }

    return await queryBuilder.orderBy("quiz_answer.updated_at", "DESC").getOne()
  }

  public async getAnswers(query: IQuizAnswerQuery): Promise<QuizAnswer[]> {
    const { id, quizId, userId } = query

    const queryBuilder: SelectQueryBuilder<
      QuizAnswer
    > = QuizAnswer.createQueryBuilder("quiz_answer")

    if (!id && !quizId && !userId) {
      return []
    }

    if (id) {
      queryBuilder.where("quiz_answer.id = :id", { id })
    }

    if (quizId) {
      queryBuilder.where("quiz_answer.quiz_id = :quiz_id", { quiz_id: quizId })
    }

    if (userId) {
      queryBuilder.where("quiz_answer.user_id = :user_id", { user_id: userId })
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
