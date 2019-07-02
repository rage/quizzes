import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  UnauthorizedError,
} from "routing-controllers"
import KafkaService from "services/kafka.service"
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserCoursePartStateService from "services/usercoursepartstate.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { PeerReview, Quiz, QuizAnswer, UserQuizState } from "../../models"
import { ITMCProfileDetails } from "../../types"

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
  private userCoursePartStateService: UserCoursePartStateService

  @Inject()
  private kafkaService: KafkaService

  @Get("/received/:answerId")
  public async getGivenReviews(
    @Param("answerId") answerId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    return await this.peerReviewService.getPeerReviews(
      this.entityManager,
      answerId,
      false,
    )
  }

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

    // Enforce unique (quiz_answer_id, user_id). Do this in db later.
    const shouldBeZero = await this.entityManager
      .createQueryBuilder(PeerReview, "peer_review")
      .where("peer_review.quiz_answer_id = :quizAnswerId", {
        quizAnswerId: peerReview.quizAnswerId,
      })
      .andWhere("peer_review.user_id = :userId", { userId: user.id })
      .getCount()

    if (shouldBeZero !== 0) {
      return {}
    }

    const receivingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      { id: peerReview.quizAnswerId },
      this.entityManager,
    )
    const givingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      {
        userId: peerReview.userId,
        quizId: receivingQuizAnswer.quizId,
        statuses: ["confirmed", "submitted"],
      },
      this.entityManager,
    )

    const quiz: Quiz = (await this.QuizService.getQuizzes({
      id: receivingQuizAnswer.quizId,
      course: true,
    }))[0]

    let responsePeerReview: PeerReview
    let responseUserQuizState: UserQuizState

    await this.entityManager.transaction(async manager => {
      responsePeerReview = await this.peerReviewService.createPeerReview(
        manager,
        peerReview,
      )

      responseUserQuizState = await this.peerReviewService.processPeerReview(
        manager,
        quiz,
        givingQuizAnswer,
        true,
      )
      await this.peerReviewService.processPeerReview(
        manager,
        quiz,
        receivingQuizAnswer,
      )

      /*const receivingValidated = await this.validationService.validateEssayAnswer(
        manager,
        quiz,
        receivingQuizAnswer,
        receivingUserQuizState,
      )
      const givingValidated = await this.validationService.validateEssayAnswer(
        manager,
        quiz,
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
        !quiz.excludedFromScore &&
        receivingValidated.quizAnswer.status === "confirmed"
      ) {
        const userId = receivingValidated.quizAnswer.userId
        await this.userCoursePartStateService.updateUserCoursePartState(manager, quiz, userId)
        this.kafkaService.publishUserProgressUpdated(
          manager,
          userId,
          quiz.courseId
        )
        this.kafkaService.publishQuizAnswerUpdated(
          receivingValidated.quizAnswer,
          receivingValidated.userQuizState,
          quiz
        )
      }

      if (
        !quiz.excludedFromScore &&
        givingValidated.quizAnswer.status === "confirmed"
      ) {
        const userId = givingValidated.quizAnswer.userId
        await this.userCoursePartStateService.updateUserCoursePartState(manager, quiz, userId)
        this.kafkaService.publishUserProgressUpdated(
          manager,
          userId,
          quiz.courseId
        )
        this.kafkaService.publishUserProgressUpdated(
          manager,
          givingValidated.quizAnswer.userId,
          quiz.courseId
        )
        this.kafkaService.publishQuizAnswerUpdated(
          givingValidated.quizAnswer,
          givingValidated.userQuizState,
          quiz
        )
      }*/
    })

    return {
      peerReview: responsePeerReview,
      userQuizState: responseUserQuizState,
    }
  }
}
