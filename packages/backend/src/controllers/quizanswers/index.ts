import { Response } from "express"
import JSONStream from "JSONStream"
import {
  BadRequestError,
  Body,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  QueryParam,
  Req,
  Res,
  UnauthorizedError,
} from "routing-controllers"
import KafkaService from "services/kafka.service"
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserCoursePartStateService from "services/usercoursepartstate.service"
import UserCourseStateService from "services/usercoursestate.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import {
  Quiz,
  QuizAnswer,
  User,
  UserCoursePartState,
  UserCourseState,
  UserQuizState,
} from "../../models"
import {
  IQuizAnswerQuery,
  ITMCProfileDetails,
  PointsByGroup,
  QuizAnswerStatus,
} from "../../types"

const MAX_LIMIT = 100

@JsonController(`${API_PATH}/quizzes/answer`)
export class QuizAnswerController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private userCoursePartStateService: UserCoursePartStateService

  @Inject()
  private userCourseStateService: UserCourseStateService

  @Inject()
  private quizService: QuizService

  @Inject()
  private validationService: ValidationService

  @Inject()
  private kafkaService: KafkaService

  @Get("/counts")
  public async getAnswerCounts(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @QueryParam("quizId") quizId?: string,
  ): Promise<any[]> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const limitDate = new Date()
    limitDate.setDate(limitDate.getDate() - 14)

    const criteriaQuery: IQuizAnswerQuery = quizId
      ? {
          quizId,
        }
      : {
          lastAllowedTime: limitDate,
          statuses: ["spam", "submitted"],
        }

    return await this.quizAnswerService.getAnswersCount(criteriaQuery)
  }

  @Get("/data/:quizId/plainAnswers")
  public async getPlainAnswers(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Param("quizId") quizId: string,
  ): Promise<any> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const answersResult = await this.quizAnswerService.getPlainAnswers(quizId)
    const answersStringStream = answersResult.pipe(JSONStream.stringify())

    return answersStringStream
  }

  @Get("/data/:quizId/plainItemAnswers")
  public async getPlainItemAnswers(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Param("quizId") quizId: string,
  ): Promise<any> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const answersResult = await this.quizAnswerService.getPlainItemAnswers(
      quizId,
    )
    const answersStringStream = answersResult.pipe(JSONStream.stringify())

    return answersStringStream
  }

  @Get("/data/:quizId/plainOptionAnswers")
  public async getPlainOptionAnswers(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Param("quizId") quizId: string,
  ): Promise<any> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const answersResult = await this.quizAnswerService.getPlainOptionAnswers(
      quizId,
    )

    const answersStringStream = answersResult.pipe(JSONStream.stringify())
    return answersStringStream
  }

  @Get("/data/:quizId")
  public async getExtensiveData(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Param("quizId") quizId: string,
  ): Promise<any> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const answersResult = await this.quizAnswerService.getCSVData(quizId)
    const answersStringStream = answersResult.pipe(JSONStream.stringify())

    return answersStringStream
  }

  @Get("/answers")
  public async getAnswers(
    @QueryParam("attention") attention: boolean,
    @QueryParam("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @QueryParam("skip") skip?: number,
    @QueryParam("limit") limit?: number,
  ): Promise<QuizAnswer[]> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
      return
    }

    let result: QuizAnswer[]

    if (limit >= MAX_LIMIT) {
      limit = MAX_LIMIT
    }

    const attentionCriteriaQuery: IQuizAnswerQuery = {
      quizId,
      addPeerReviews: true,
      addSpamFlagNumber: true,
      skip,
      limit,
    }

    if (attention) {
      const limitDate = new Date()
      limitDate.setDate(limitDate.getDate() - 14)
      attentionCriteriaQuery.lastAllowedTime = limitDate
      attentionCriteriaQuery.statuses = ["spam", "submitted"]
    }

    result = await this.quizAnswerService.getAnswers(attentionCriteriaQuery)
    return result
  }

  @Post("/:answerId")
  public async modifyStatus(
    @Param("answerId") id: string,
    @Body() body: { newStatus: QuizAnswerStatus },
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const newStatus: QuizAnswerStatus = body.newStatus

    const existingAnswer = await this.quizAnswerService.getAnswer(
      { id },
      this.entityManager,
    )

    if (!existingAnswer) {
      return
    }

    const quiz = (await this.quizService.getQuizzes({
      id: existingAnswer.quizId,
    }))[0]

    let userQuizState = await this.userQuizStateService.getUserQuizState(
      existingAnswer.userId,
      existingAnswer.quizId,
    )

    if (!userQuizState) {
      userQuizState = new UserQuizState()
      userQuizState.userId = existingAnswer.userId
      userQuizState.quizId = existingAnswer.quizId
      userQuizState.pointsAwarded = 0
      userQuizState = await this.userQuizStateService.createAndCompleteUserQuizState(
        this.entityManager,
        userQuizState,
      )
    }

    let newAnswer: QuizAnswer = null
    let userCoursePartState: UserCoursePartState = null

    await this.entityManager.transaction(async manager => {
      const oldStatus = existingAnswer.status
      existingAnswer.status = newStatus
      newAnswer = await manager.save(existingAnswer)

      if (newStatus === "confirmed" && oldStatus !== "confirmed") {
        userQuizState.pointsAwarded = quiz.points

        userQuizState = await manager.save(userQuizState)

        userCoursePartState = await this.userCoursePartStateService.updateUserCoursePartState(
          manager,
          quiz,
          userQuizState.userId,
        )

        this.kafkaService.publishQuizAnswerUpdated(
          newAnswer,
          userQuizState,
          quiz,
        )
        this.kafkaService.publishUserProgressUpdated(
          manager,
          newAnswer.userId,
          quiz.courseId,
        )
      }
    })

    return {
      newAnswer,
      userQuizState,
      userCoursePartState,
    }
  }

  @Post("/")
  public async post(
    @EntityFromBody() answer: QuizAnswer,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    const userId = user.id

    if (!answer.quizId || !answer.languageId) {
      throw new BadRequestError("Answer must contain some data")
    }
    answer.userId = userId

    // creates new user if necessary
    answer.user = new User()
    answer.user.id = answer.userId

    const quiz: Quiz = (await this.quizService.getQuizzes({
      id: answer.quizId,
      items: true,
      options: true,
      peerreviews: true,
      course: true,
    }))[0]

    const userQState: UserQuizState =
      (await this.userQuizStateService.getUserQuizState(
        answer.userId,
        answer.quizId,
      )) || new UserQuizState()

    const originalPoints = userQState.pointsAwarded || 0

    let savedAnswer: QuizAnswer
    let savedUserQuizState: UserQuizState

    console.log("quiz answer status before validation: ", answer.status)
    console.log("option answers:")
    answer.itemAnswers.forEach(ia => {
      if (ia.optionAnswers && ia.optionAnswers.length > 0) {
        ia.optionAnswers.forEach(oa => console.log(oa))
      }
    })

    await this.entityManager.transaction(async manager => {
      const {
        response,
        quizAnswer,
        userQuizState,
      } = this.validationService.validateQuizAnswer(answer, quiz, userQState)

      console.log("quiz answer status after validation: ", quizAnswer.status)

      const erroneousItemAnswers = response.itemAnswerStatus.filter(status => {
        return status.error ? true : false
      })

      if (erroneousItemAnswers.length > 0) {
        throw new BadRequestError(
          `${erroneousItemAnswers.map(x => {
            if (x.type === "essay") {
              return `${x.error} Min: ${x.min}, max: ${x.max}. Your answer (${
                x.data.words
              } words): ${x.data.text}`
            } else if (x.type === "scale") {
              return `${x.error} Min: ${x.min}, max: ${x.max}. Your answer: ${
                x.data.answerValue
              }`
            }
          })}`,
        )
      }

      await this.validationService.checkForDeprecated(manager, quizAnswer)

      console.log("quiz answer after deprecation changes: ", quizAnswer)
      console.log("option answers:")
      quizAnswer.itemAnswers.forEach(ia => {
        if (ia.optionAnswers && ia.optionAnswers.length > 0) {
          ia.optionAnswers.forEach(oa => console.log(oa))
        }
      })

      savedAnswer = await this.quizAnswerService.createQuizAnswer(
        manager,
        quizAnswer,
      )

      console.log("quiz answer status after saving it: ", savedAnswer.status)

      savedUserQuizState = await this.userQuizStateService.createUserQuizState(
        manager,
        userQuizState,
      )

      if (
        originalPoints < savedUserQuizState.pointsAwarded &&
        !quiz.excludedFromScore
      ) {
        await this.userCoursePartStateService.updateUserCoursePartState(
          manager,
          quiz,
          userQuizState.userId,
        )

        this.kafkaService.publishUserProgressUpdated(
          manager,
          userId,
          quiz.courseId,
        )
      }

      this.kafkaService.publishQuizAnswerUpdated(
        savedAnswer,
        savedUserQuizState,
        quiz,
      )
    })

    console.log(
      "Quiz answer atht the end of post answer controller: ",
      savedAnswer,
    )

    if (
      savedUserQuizState.status === "open" &&
      Math.abs(savedUserQuizState.pointsAwarded - quiz.points) > 0.001
    ) {
      return {
        userQuizState: savedUserQuizState,
        quizAnswer: savedAnswer,
      }
    }

    return {
      quiz,
      quizAnswer: savedAnswer,
      userQuizState: savedUserQuizState,
    }
  }
}
