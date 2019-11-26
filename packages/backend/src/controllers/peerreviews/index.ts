import JSONStream from "JSONStream"
import {
  BadRequestError,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  UnauthorizedError,
  QueryParam,
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
import { PeerReviewQuestionAnswer } from "@quizzes/common/models"

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
    @QueryParam("stripped") stripped: boolean,
  ) {
    if (!user.administrator) {
      stripped = true
      const answer = await this.quizAnswerService.getAnswer(
        { id: answerId },
        this.entityManager,
      )
      if (answer.userId !== user.id) {
        throw new UnauthorizedError("unauthorized")
      }
    }

    const result = await this.peerReviewService.getPeerReviews(
      this.entityManager,
      answerId,
      false,
    )
    if (stripped) {
      const strippedResult = result.map(prAnswer => ({
        id: prAnswer.id,
        peerReviewCollectionId: prAnswer.peerReviewCollectionId,
        answers: prAnswer.answers,
      }))

      return strippedResult
    } else {
      return result
    }
  }

  @Get("/data/:quizId/plainPeerReviews")
  public async getDetailedPlainPeerReviews(
    @Param("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.peerReviewService.getPlainPeerReviews(quizId)
    const stringStream = result.pipe(JSONStream.stringify())

    return stringStream
  }

  @Get("/data/:quizId/plainAnswers")
  public async getDetailedPlainPeerReviewQuestionAnswers(
    @Param("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.peerReviewService.getPlainPeerReviewAnswers(
      quizId,
    )

    const stringStream = result.pipe(JSONStream.stringify())

    return stringStream
  }

  @Get("/data/:quizId")
  public async getDetailedPeerReviews(
    @Param("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.peerReviewService.getCSVData(quizId)

    const stringStream = result.pipe(JSONStream.stringify())

    return stringStream
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
    peerReview.answers.forEach(answer => {
      if (answer.text) {
        return
      }
      if (answer.value === null) {
        throw new BadRequestError("review must contain values")
      }
    })

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
        statuses: ["confirmed", "submitted", "enough-received-but-not-given"],
      },
      this.entityManager,
    )

    const quiz: Quiz = (await this.QuizService.getQuizzes({
      id: receivingQuizAnswer.quizId,
      course: true,
      items: true,
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
    })

    return {
      peerReview: responsePeerReview,
      userQuizState: responseUserQuizState,
    }
  }
}
