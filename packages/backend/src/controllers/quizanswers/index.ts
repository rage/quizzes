import JSONStream from "JSONStream"
import {
  BadRequestError,
  Body,
  Get,
  HeaderParam,
  HeaderParams,
  JsonController,
  Param,
  Post,
  QueryParam,
  Req,
  Res,
  UnauthorizedError,
  QueryParams,
} from "routing-controllers"
import AuthorizationService, {
  Permission,
} from "services/authorization.service"
import KafkaService from "services/kafka.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserCoursePartStateService from "services/usercoursepartstate.service"
import UserCourseRoleService from "services/usercourserole.service"
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

import CourseService from "services/course.service"
import { MessageType, pushMessageToClient } from "../../wsServer"

const MAX_LIMIT = 100

@JsonController(`${API_PATH}/quizzes/answer`)
export class QuizAnswerController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private authorizationService: AuthorizationService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private userCoursePartStateService: UserCoursePartStateService

  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @Inject()
  private userCourseStateService: UserCourseStateService

  @Inject()
  private courseService: CourseService

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
    const roleCount = await this.userCourseRoleService.getRolesCount(user.id)

    if (roleCount < 1 && !user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    // looking for only one count -> easy to check if permitted
    if (quizId) {
      const authorized = await this.authorizationService.isPermitted({
        user,
        quizId,
        permission: Permission.VIEW,
      })
      if (!authorized) {
        throw new UnauthorizedError("unauthorized")
      }
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
          quizRequiresPeerReviews: true,
          user,
        }

    // only one quiz and user has permission to view the course -> safe to return
    if (user.administrator || quizId) {
      return await this.quizAnswerService.getAnswersCount(criteriaQuery)
    }

    const roles = await this.userCourseRoleService.getUserCourseRoles({
      userId: user.id,
    })

    criteriaQuery.courseIds = roles.map(r => r.courseId)
    criteriaQuery.courseIdIncludedInCourseIds = true

    const result = await this.quizAnswerService.getAnswersCount(criteriaQuery)

    return result
  }

  @Get("/data/:quizId/plainAnswers")
  public async getPlainAnswers(
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Param("quizId") quizId: string,
  ): Promise<any> {
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
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
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
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
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
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
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
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
    @QueryParam("minDate") minDate?: string,
    @QueryParam("maxDate") maxDate?: string,
    @QueryParam("statuses") statuses?: string[],
    @QueryParam("minSpamFlags") minSpamFlags?: number,
    @QueryParam("maxSpamFlags") maxSpamFlags?: number,
    @QueryParam("minGivenPeerReviews") minGivenPeerReviews?: number,
    @QueryParam("maxGivenPeerReviews") maxGivenPeerReviews?: number,
    @QueryParam("minReceivedPeerReviews") minReceivedPeerReviews?: number,
    @QueryParam("maxReceivedPeerReviews") maxReceivedPeerReviews?: number,
    @QueryParam("minAverageOfGrades") minAverageOfGrades?: number,
    @QueryParam("maxAverageOfGrades") maxAverageOfGrades?: number,
  ): Promise<QuizAnswer[] | string> {
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.GRADE,
    })

    if (!authorized) {
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
      const quizzes = await this.quizService.getQuizzes({ id: quizId })

      if (!quizzes || quizzes.length === 0) {
        throw new Error("Invalid quiz id!")
      }

      const courses = await this.courseService.getCourses({
        id: quizzes[0].courseId,
      })
      if (!courses || courses.length === 0) {
        throw new Error("Quiz has no corresponding course")
      }

      const course = courses[0]

      attentionCriteriaQuery.quizRequiresPeerReviews = true

      if (course.texts[0].abbreviation.includes("elements-of-ai")) {
        attentionCriteriaQuery.statuses = [
          "spam",
          "submitted",
          "enough-received-but-not-given",
        ]
        attentionCriteriaQuery.minPeerReviewsGiven = course.minPeerReviewsGiven
        attentionCriteriaQuery.minPeerReviewsReceived =
          course.minPeerReviewsReceived
        attentionCriteriaQuery.minSpamFlagsOr = 1
      } else {
        const limitDate = new Date()
        limitDate.setDate(limitDate.getDate() - 14)
        attentionCriteriaQuery.lastAllowedTime = limitDate
        attentionCriteriaQuery.statuses = ["spam", "submitted"]
      }
    } else {
      attentionCriteriaQuery.firstAllowedTime = minDate && new Date(minDate)
      attentionCriteriaQuery.lastAllowedTime = maxDate && new Date(maxDate)
      attentionCriteriaQuery.statuses = statuses
      attentionCriteriaQuery.minPeerReviewsGiven = minGivenPeerReviews
      attentionCriteriaQuery.maxPeerReviewsGiven = maxGivenPeerReviews
      attentionCriteriaQuery.minPeerReviewsReceived = minReceivedPeerReviews
      attentionCriteriaQuery.maxPeerReviewsReceived = maxReceivedPeerReviews
      attentionCriteriaQuery.minPeerReviewAverage = minAverageOfGrades
      attentionCriteriaQuery.maxPeerReviewAverage = maxAverageOfGrades
      attentionCriteriaQuery.minSpamFlags = minSpamFlags
      attentionCriteriaQuery.maxSpamFlags = maxSpamFlags
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
    const authorized = await this.authorizationService.isPermitted({
      user,
      answerId: id,
      permission: Permission.GRADE,
    })

    if (!authorized) {
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
      course: true,
      items: true,
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

      if (newStatus !== oldStatus) {
        if (newStatus === "confirmed") {
          userQuizState.pointsAwarded = quiz.points
        } else if (
          newStatus === "rejected" &&
          (!quiz.triesLimited || userQuizState.tries < quiz.tries)
        ) {
          userQuizState.peerReviewsReceived = 0
          userQuizState.pointsAwarded = 0
          userQuizState.spamFlags = 0
          userQuizState.status = "open"
        }

        userQuizState = await manager.save(userQuizState)

        userCoursePartState = await this.userCoursePartStateService.updateUserCoursePartState(
          manager,
          quiz,
          userQuizState.userId,
        )

        await this.kafkaService.publishQuizAnswerUpdated(
          newAnswer,
          userQuizState,
          quiz,
        )
        await this.kafkaService.publishUserProgressUpdated(
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

    // make sure that new answer (and item/option answers) are created for each submission
    answer.userId = userId
    answer.id = undefined
    answer.itemAnswers.forEach(ia => {
      ia.quizAnswerId = undefined
      ia.id = undefined
      ia.optionAnswers.forEach(oa => {
        oa.quizItemAnswerId = undefined
        oa.id = undefined
      })
    })

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

    const now = new Date()

    if (quiz.deadline && quiz.deadline.getTime() < now.getTime()) {
      throw new BadRequestError("No submissions past deadline")
    }

    const userQState: UserQuizState =
      (await this.userQuizStateService.getUserQuizState(
        answer.userId,
        answer.quizId,
      )) || new UserQuizState()

    if (userQState.status === "locked") {
      throw new BadRequestError("Already answered")
    }

    const originalPoints = userQState.pointsAwarded || 0

    let savedAnswer: QuizAnswer
    let savedUserQuizState: UserQuizState

    await this.entityManager.transaction(async manager => {
      const {
        response,
        quizAnswer,
        userQuizState,
      } = this.validationService.validateQuizAnswer(answer, quiz, userQState)

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

      if (
        originalPoints < savedUserQuizState.pointsAwarded &&
        !quiz.excludedFromScore
      ) {
        await this.userCoursePartStateService.updateUserCoursePartState(
          manager,
          quiz,
          userQuizState.userId,
        )
        await this.kafkaService.publishUserProgressUpdated(
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

    if (
      savedUserQuizState.status === "open" &&
      Math.abs(savedUserQuizState.pointsAwarded - quiz.points) > 0.001
    ) {
      return {
        userQuizState: savedUserQuizState,
        quizAnswer: savedAnswer,
      }
    }

    pushMessageToClient(
      userId,
      quiz.course.moocfiId,
      MessageType.PROGRESS_UPDATED,
    )

    return {
      quiz,
      quizAnswer: savedAnswer,
      userQuizState: savedUserQuizState,
    }
  }

  @Get("/answered/:courseId")
  public async getAnswered(
    @Param("courseId") courseId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    const answered = await this.quizAnswerService.getAnswered(courseId, user.id)
    const answeredByQuizId: { [id: string]: any } = {}
    answered.forEach(a => {
      answeredByQuizId[a.quiz_id] = {
        answered: a.answered,
        correct: a.correct,
      }
    })
    return answeredByQuizId
  }
}
