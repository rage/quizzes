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
import { PeerReviewService } from "services/peerreview.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/:id/peerreview/:answerer")
export class PeerReviewController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private peerReviewService: PeerReviewService

  @Get("/")
  public async get(
    @Param("id") id: string,
    @Param("answerer") answerer: string,
  ) {
    return await this.peerReviewService.getAnswersToReview(id, answerer)
  }

  /*@Post("/")
  public async post(
    @Param("id") id: string,
    @EntityFromBody() quizAnswer: QuizAnswer,
  ): Promise<QuizAnswer> {
    return await this.quizAnswerService.createQuizAnswer(quizAnswer)
  }*/
}
