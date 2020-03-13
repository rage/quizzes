import JSONStream from "JSONStream"
import {
  BadRequestError,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  QueryParam,
  UnauthorizedError,
} from "routing-controllers"
import AuthorizationService, {
  Permission,
} from "services/authorization.service"
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { PeerReview, Quiz, QuizAnswer, UserQuizState } from "../../models"
import { ITMCProfileDetails } from "../../types"

import { MessageType, pushMessageToClient } from "../../wsServer"

@JsonController(`${API_PATH}/quizzes/peerreview`)
export class PeerReviewController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private authorizationService: AuthorizationService

  @Inject()
  private peerReviewService: PeerReviewService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private QuizService: QuizService

  @Get(
    "/:quizId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/:languageId",
  )
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

  @Get("/received/:answerId")
  public async getGivenReviews(
    @Param("answerId") answerId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @QueryParam("stripped") stripped: boolean,
  ) {
    const authorized = await this.authorizationService.isPermitted({
      user,
      answerId,
      permission: Permission.VIEW,
    })

    if (!authorized) {
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
        createdAt: prAnswer.createdAt,
        answers: prAnswer.answers.map(prqa => {
          const { createdAt, updatedAt, ...relevant } = prqa
          return relevant
        }),
      }))

      return strippedResult
    }

    return result
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

    const oldStatus = receivingQuizAnswer.status

    const givingQuizAnswer: QuizAnswer = await this.quizAnswerService.getAnswer(
      {
        userId: peerReview.userId,
        quizId: receivingQuizAnswer.quizId,
        statuses: [
          "confirmed",
          "submitted",
          "enough-received-but-not-given",
          // receiving 1 spam flag could make status 'manual-review'
          "manual-review",
        ],
      },
      this.entityManager,
    )

    const quiz: Quiz = (await this.QuizService.getQuizzes({
      id: receivingQuizAnswer.quizId,
      course: true,
      items: true,
    }))[0]

    let responsePeerReview: PeerReview
    let responseQuizAnswer: QuizAnswer
    let responseUserQuizState: UserQuizState

    await this.entityManager.transaction(async manager => {
      responsePeerReview = await this.peerReviewService.createPeerReview(
        manager,
        peerReview,
      )

      const givingUpdated = await this.peerReviewService.processPeerReview(
        manager,
        quiz,
        givingQuizAnswer,
        true,
      )

      responseQuizAnswer = givingUpdated.answer
      responseUserQuizState = givingUpdated.state

      const receivingUpdated = await this.peerReviewService.processPeerReview(
        manager,
        quiz,
        receivingQuizAnswer,
      )

      const newStatus = receivingUpdated.answer.status
      const messages: MessageType[] = [MessageType.PEER_REVIEW_RECEIVED]

      if (oldStatus !== newStatus) {
        if (newStatus === "confirmed") {
          messages.push(MessageType.QUIZ_CONFIRMED)
        }
        if (newStatus === "rejected" || newStatus === "spam") {
          messages.push(MessageType.QUIZ_REJECTED)
        }
      }

      messages.forEach(message => {
        pushMessageToClient(
          receivingQuizAnswer.userId,
          quiz.course.moocfiId,
          message,
          quiz.id,
        )
      })
    })

    return {
      peerReview: responsePeerReview,
      quizAnswer: responseQuizAnswer,
      userQuizState: responseUserQuizState,
    }
  }

  @Get("/data/:quizId/plainPeerReviews")
  public async getDetailedPlainPeerReviews(
    @Param("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
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
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
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
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.peerReviewService.getCSVData(quizId)

    const stringStream = result.pipe(JSONStream.stringify())

    return stringStream
  }
}
