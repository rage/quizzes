import { PeerReview, QuizAnswer, UserQuizState } from "@quizzes/common/models"
import { ITMCProfileDetails } from "@quizzes/common/types"
import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
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
import { API_PATH } from "../../config"

@JsonController(`${API_PATH}/quizzes/peerreview`)
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

  @Get("/:quizId/:languageId")
  public async get(
    @Param("quizId") quizId: string,
    @Param("languageId") languageId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    return await this.peerReviewService.getAnswersToReview(
      quizId,
      languageId,
      user.id,
    )
  }

  @Post("/")
  public async post(
    @EntityFromBody() peerReview: PeerReview,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    peerReview.userId = user.id

    const receivingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      { id: peerReview.quizAnswerId },
      this.entityManager,
    )
    const givingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      {
        userId: peerReview.userId,
        quizId: receivingQuizAnswer.quizId,
        status: "submitted",
      },
      this.entityManager,
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

    let responsePeerReview: PeerReview
    let responseUserQuizState: UserQuizState

    await this.entityManager.transaction(async manager => {
      responsePeerReview = await this.peerReviewService.createPeerReview(
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
      const receivingAnswerUpdated: QuizAnswer = await this.quizAnswerService.createQuizAnswer(
        manager,
        receivingValidated.quizAnswer,
      )
      const givingAnswerUpdated = await this.quizAnswerService.createQuizAnswer(
        manager,
        givingValidated.quizAnswer,
      )
      await this.userQuizStateService.createUserQuizState(
        manager,
        receivingValidated.userQuizState,
      )
      responseUserQuizState = await this.userQuizStateService.createUserQuizState(
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
          receivingAnswerUpdated,
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
          givingAnswerUpdated,
        )
      }
    })
    return {
      peerReview: responsePeerReview,
      userQuizState: responseUserQuizState,
    }
  }
}
