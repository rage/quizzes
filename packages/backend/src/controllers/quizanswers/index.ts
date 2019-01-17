import { QuizAnswer } from "@quizzes/common/models"
import {
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  QueryParam,
  QueryParams,
} from "routing-controllers"
import { QuizAnswerService } from "services/quizanswer.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/:id/answer")
export class QuizAnswerController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Post("/")
  public async post(
    @Param("id") id: string,
    @EntityFromBody() quizAnswer: QuizAnswer,
  ): Promise<QuizAnswer> {
    return await this.quizAnswerService.createQuizAnswer(quizAnswer)
  }
}
