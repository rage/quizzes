import {
  PeerReview,
  Quiz,
  QuizAnswer,
  SpamFlag,
  UserQuizState,
} from "@quizzes/common/models"
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
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import SpamFlagService from "services/spamflag.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/spamflag")
export class SpamFlagController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private spamFlagService: SpamFlagService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private quizService: QuizService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private validationService: ValidationService

  @Post("/")
  public async post(@EntityFromBody() spamFlag: SpamFlag) {
    const quizAnswer = await this.quizAnswerService.getAnswer({
      id: spamFlag.quizAnswerId,
    })
    const quiz: Quiz[] = await this.quizService.getQuizzes({
      id: quizAnswer.quizId,
      course: true,
    })
    const userquizstate = await this.userQuizStateService.getUserQuizState(
      quizAnswer.userId,
      quizAnswer.quizId,
    )
    userquizstate.spamFlags += 1
    let response
    await this.entityManager.transaction(async manager => {
      const validated = await this.validationService.validateEssayAnswer(
        manager,
        quiz[0],
        quizAnswer,
        userquizstate,
      )
      await this.quizAnswerService.createQuizAnswer(
        manager,
        validated.quizAnswer,
      )
      await this.userQuizStateService.createUserQuizState(
        manager,
        validated.userQuizState,
      )
      response = await this.spamFlagService.createSpamFlag(manager, spamFlag)
    })
    return response
  }
}
