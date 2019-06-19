import {
  BadRequestError,
  Body,
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  QueryParam,
  UnauthorizedError,
} from "routing-controllers"
import KafkaService from "services/kafka.service"
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
  private KafkaService: KafkaService

  @Get("/counts")
  public async getAnswerCounts(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @QueryParam("quizId") quizId?: string,
  ): Promise<any[]> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    return quizId
      ? await this.quizAnswerService.getNumberOfAnswers(quizId)
      : await this.quizAnswerService.getAttentionAnswersCount()
  }

  @Get("/statistics")
  public async getAnswerStatistics(
    @QueryParam("quizId") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.quizAnswerService.getAnswersStatistics(quizId)
    return result
  }

  @Get("/attention")
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

    result = attention
      ? await this.quizAnswerService.getAttentionAnswers(
          quizId,
          skip,
          limit,
          true,
        )
      : await this.quizAnswerService.getEveryonesAnswers(
          quizId,
          skip,
          limit,
          true,
        )

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
    const userId = user.id

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

    await this.entityManager.transaction(async manager => {
      const {
        response,
        quizAnswer,
        userQuizState,
      } = await this.validationService.validateQuizAnswer(
        manager,
        answer,
        quiz,
        userQState,
      )

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

      savedAnswer = await this.quizAnswerService.createQuizAnswer(
        manager,
        quizAnswer,
      )

      savedUserQuizState = await this.userQuizStateService.createUserQuizState(
        manager,
        userQuizState,
      )

      if (originalPoints < savedUserQuizState.pointsAwarded) {
        await this.userCoursePartStateService.updateUserCoursePartState(
          manager,
          quiz,
          userQuizState.userId,
        )

        const courseId = quiz.courseId

        const progress: PointsByGroup[] = await this.userCoursePartStateService.getProgress(
          manager,
          userId,
          courseId,
        )

        this.KafkaService.sendMessage(userId, courseId, progress)
      }

      /*if (!quiz[0].excludedFromScore && savedAnswer.status === "confirmed") {
        await this.userCourseStateService.updateUserCourseState(
          manager,
          quiz[0],
          savedUserQuizState,
          savedAnswer,
        )
      }*/
    })

    return {
      quiz,
      quizAnswer: savedAnswer,
      userQuizState: savedUserQuizState,
    }
  }
}
