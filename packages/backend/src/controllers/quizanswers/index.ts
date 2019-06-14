import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  BadRequestError,
  QueryParam,
  UnauthorizedError,
  Body,
} from "routing-controllers"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserCourseStateService from "services/usercoursestate.service"
import UserCoursePartStateService from "services/usercoursepartstate.service"
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
  ITMCProfileDetails,
  IQuizAnswerQuery,
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

  @Get("/data/:quizId")
  public async getExtensiveData(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Param("quizId") quizId: string,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    return await this.quizAnswerService.getCSVData(quizId)
  }

  @Get("/")
  public async getEveryonesAnswers(
    @QueryParam("attention") attention: boolean,
    @QueryParam("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @QueryParam("skip") skip?: number,
    @QueryParam("limit") limit?: number,
  ): Promise<QuizAnswer[]> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
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
      { id: id },
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
    let userCourseState: UserCourseState = null
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

        userCourseState = await this.userCourseStateService.updateUserCourseState(
          manager,
          quiz,
          userQuizState,
          newAnswer,
        )
      }
    })

    return {
      newAnswer,
      userQuizState,
      userCoursePartState,
      userCourseState,
    }
  }

  @Post("/")
  public async post(
    @EntityFromBody() answer: QuizAnswer,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    answer.userId = user.id
    // creates new user if necessary
    answer.user = new User()
    answer.user.id = answer.userId

    const quiz: Quiz[] = await this.quizService.getQuizzes({
      id: answer.quizId,
      items: true,
      options: true,
      peerreviews: true,
      course: true,
    })

    const userQState: UserQuizState = await this.userQuizStateService.getUserQuizState(
      answer.userId,
      answer.quizId,
    )

    const {
      response,
      quizAnswer,
      userQuizState,
    } = this.validationService.validateQuizAnswer(answer, quiz[0], userQState)

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
    let savedAnswer: QuizAnswer
    let savedUserQuizState: UserQuizState

    await this.entityManager.transaction(async manager => {
      await this.validationService.checkForDeprecated(manager, quizAnswer)

      savedAnswer = await this.quizAnswerService.createQuizAnswer(
        manager,
        quizAnswer,
      )

      savedUserQuizState = await this.userQuizStateService.createUserQuizState(
        manager,
        userQuizState,
      )

      if (!quiz[0].excludedFromScore && savedAnswer.status === "confirmed") {
        await this.userCourseStateService.updateUserCourseState(
          manager,
          quiz[0],
          savedUserQuizState,
          savedAnswer,
        )
      }
    })

    return {
      quiz: quiz[0],
      quizAnswer: savedAnswer,
      userQuizState: savedUserQuizState,
    }
  }
}
