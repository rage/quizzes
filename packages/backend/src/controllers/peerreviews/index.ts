import {
  PeerReview,
  Quiz,
  QuizAnswer,
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
import UserCourseStateService from "services/usercoursestate.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/peerreview")
export class PeerReviewController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private peerReviewService: PeerReviewService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private QuizService: QuizService

  @Inject()
  private validationService: ValidationService

  @Inject()
  private userCourseStateService: UserCourseStateService

  @Get("/")
  public async get(
    @Param("id") id: string,
    @Param("answerer") answerer: string,
  ) {
    return await this.peerReviewService.getAnswersToReview(id, answerer)
  }

  @Post("/")
  public async post(@EntityFromBody() peerReview: PeerReview): Promise<any> {
    const receivingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      { id: peerReview.quizAnswerId },
    )
    const givingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      {
        userId: peerReview.userId,
        quizId: receivingQuizAnswer.quizId,
        status: "submitted",
      },
    )

    const receivingUserQuizState: UserQuizState = await this.userQuizStateService.getUserQuizState(
      receivingQuizAnswer.userId,
      receivingQuizAnswer.quizId,
    )
    const givingUserQuizState: UserQuizState = await this.userQuizStateService.getUserQuizState(
      peerReview.userId,
      receivingQuizAnswer.quizId,
    )

    const quiz = await this.QuizService.getQuizzes({
      id: receivingQuizAnswer.quizId,
      course: true,
    })

    receivingUserQuizState.peerReviewsReceived += 1
    givingUserQuizState.peerReviewsGiven += 1

    let response: PeerReview

    await this.entityManager.transaction(async manager => {
      response = await this.peerReviewService.createPeerReview(
        manager,
        peerReview,
      )
      const receivingValidated = await this.validationService.validateEssayAnswer(
        manager,
        quiz[0],
        receivingQuizAnswer,
        receivingUserQuizState,
      )
      const givingValidated = await this.validationService.validateEssayAnswer(
        manager,
        quiz[0],
        givingQuizAnswer,
        givingUserQuizState,
      )
      await this.quizAnswerService.createQuizAnswer(
        manager,
        receivingValidated.quizAnswer,
      )
      await this.quizAnswerService.createQuizAnswer(
        manager,
        givingValidated.quizAnswer,
      )
      await this.userQuizStateService.createUserQuizState(
        manager,
        receivingValidated.userQuizState,
      )
      await this.userQuizStateService.createUserQuizState(
        manager,
        givingValidated.userQuizState,
      )
      if (
        !quiz[0].excludedFromScore &&
        receivingValidated.quizAnswer.status === "confirmed"
      ) {
        await this.userCourseStateService.updateUserCourseState(
          manager,
          quiz[0],
          receivingValidated.userQuizState,
        )
      }
      if (
        !quiz[0].excludedFromScore &&
        givingValidated.quizAnswer.status === "confirmed"
      ) {
        await this.userCourseStateService.updateUserCourseState(
          manager,
          quiz[0],
          givingValidated.userQuizState,
        )
      }
    })
    return response
  }

  /*@Post("/")
  public async post(
    @Param("id") id: string,
    @EntityFromBody() quizAnswer: QuizAnswer,
  ): Promise<QuizAnswer> {
    return await this.quizAnswerService.createQuizAnswer(quizAnswer)
  }*/
}
