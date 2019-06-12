import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  BadRequestError,
  QueryParam,
  UnauthorizedError,
} from "routing-controllers"
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
import { Quiz, QuizAnswer, User, UserQuizState } from "../../models"
import { ITMCProfileDetails, IQuizAnswerQuery } from "../../types"

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

    const limitDate = new Date()
    limitDate.setDate(limitDate.getDate() - 300)

    const attentionCriteriaQuery: IQuizAnswerQuery = {
      quizId,
      firstAllowedTime: limitDate,
      statuses: ["spam", "submitted"],
      addPeerReviews: true,
    }

    const result = await this.quizAnswerService.getAnswersStatistics(quizId)
    return result
  }

  @Get("/salainen_testi")
  public async getAnswersByCriteria(
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const query: IQuizAnswerQuery = {
      // id: "juu",
      quizId: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
      userId: 87900,

      // should prob only use statuses
      statuses: ["confirmed", "rejected"],

      firstAllowedTime: new Date(2018, 7, 1),
      lastAllowedTime: new Date(2018, 7, 10),

      languageIds: ["en_US"],
      // peerReviewsGiven: 2,
      /*
      peerReviewsReceived: 0,
      spamFlags: 0,



      792296
      792296
      */
      addPeerReviews: true,
    }
    const result = await this.quizAnswerService.getAnswers(query)

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

    const attentionCriteriaQuery: IQuizAnswerQuery = {
      quizId,
      addPeerReviews: true,
      skip,
      limit,
    }

    if (attention) {
      const limitDate = new Date()
      limitDate.setDate(limitDate.getDate() - 300)
      attentionCriteriaQuery.firstAllowedTime = limitDate
      attentionCriteriaQuery.statuses = ["spam", "submitted"]
    }

    result = await this.quizAnswerService.getAnswers(attentionCriteriaQuery)

    return result
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
