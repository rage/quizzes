import { Response } from "express"
import JSONStream from "JSONStream"
import _ from "lodash"
import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  QueryParam,
  QueryParams,
  Res,
  UnauthorizedError,
} from "routing-controllers"
import AuthorizationService, {
  Permission,
} from "services/authorization.service"
import KafkaService from "services/kafka.service"
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserCourseRoleService from "services/usercourserole.service"
import UserQuizStateService from "services/userquizstate.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import validator from "validator"
import { API_PATH } from "../../config"
import { Quiz, QuizAnswer, UserQuizState } from "../../models"
import { IQuizQuery, ITMCProfileDetails } from "../../types"
import { getUUIDByString } from "../../util"

@JsonController(`${API_PATH}/quizzes`)
export class QuizController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private authorizationService: AuthorizationService

  @Inject()
  private peerReviewService: PeerReviewService

  @Inject()
  private quizService: QuizService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @Inject()
  private kafkaService: KafkaService

  @Get("/")
  public async getAll(
    @QueryParams() params: string[],
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Quiz[]> {
    const paramsObj: any = params
    let authorized = user.administrator

    if (!authorized && paramsObj.course === "true") {
      const courseId = paramsObj.courseId

      authorized = await this.authorizationService.isPermitted({
        user,
        courseId,
        permission: Permission.VIEW,
      })
    }

    if (!authorized) {
      throw new UnauthorizedError("unauthorized")
    }

    return await this.getQuizzes(null, params)
  }

  @Get("/:id")
  public async get(
    @Param("id") id: string,
    @QueryParams() params: any,
    @QueryParam("fullInfo") fullInfo: boolean,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    try {
      const quizId = validator.isUUID(id) ? id : getUUIDByString(id)
      if (!user) {
        const basicInfo =
          fullInfo === false
            ? await this.quizService.getQuizzes({
                id: quizId,
                stripped: true,
              })
            : await this.quizService.getQuizzes({
                id: quizId,
                peerreviews: true,
                stripped: true,
                items: true,
                options: true,
              })

        return basicInfo[0]
      }

      let userQuizState: UserQuizState
      try {
        userQuizState = await this.userQuizStateService.getUserQuizState(
          user.id,
          quizId,
        )
      } catch (error) {
        console.log("not found")
      }

      let stripped = true

      let quizAnswer: QuizAnswer
      if (userQuizState) {
        const answer = await this.quizAnswerService.getAnswer(
          { quizId, userId: user.id },
          this.entityManager,
        )

        const helperQuiz = (await this.quizService.getQuizzes({
          id: quizId,
        }))[0]

        if (
          userQuizState.status === "locked" ||
          Math.abs(userQuizState.pointsAwarded - helperQuiz.points) < 0.001
        ) {
          stripped = false
        }

        quizAnswer = answer
      }

      const quizzes: Quiz[] = await this.quizService.getQuizzes({
        id: quizId,
        items: true,
        options: true,
        peerreviews: true,
        course: true,
        stripped,
        ...params,
      })

      const quiz = quizzes[0]
      /*
      if(userQuizState && (userQuizState.status !== "locked")){
        return {
          quiz,
          userQuizState
        }
      }
      */

      const result = {
        quiz,
        quizAnswer,
        userQuizState,
      }

      return result
    } catch (error) {
      console.log(error)
    }
  }

  @Get("/:course/titles/:language")
  public async getCourseQuizTitles(
    @Param("course") courseId: string,
    @Param("language") language: string,
  ) {
    const quizzes: Quiz[] = await this.quizService.getQuizzes({
      courseId,
      language,
    })
    const titlesById: { [id: string]: string } = {}
    quizzes.forEach(quiz => {
      titlesById[quiz.id] = quiz.texts[0].title
    })
    return titlesById
  }

  @Get("/data/:id/plainQuizInfo")
  public async getPlainQuizInfo(
    @Param("id") quizId: string,
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

    const result = await this.quizService.getPlainQuizData(quizId)
    const answersStringStream = result.pipe(JSONStream.stringify())
    return answersStringStream
  }

  @Get("/data/:id/plainQuizItems")
  public async getPlainQuizItems(
    @Param("id") quizId: string,
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

    const result = await this.quizService.getPlainQuizItems(quizId)
    const answersStringStream = result.pipe(JSONStream.stringify())

    return answersStringStream
  }

  @Get("/data/:id/plainQuizOptions")
  public async getPlainQuizOptions(
    @Param("id") quizId: string,
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

    const result = await this.quizService.getPlainQuizItemOptions(quizId)
    const answersStringStream = result.pipe(JSONStream.stringify())
    return answersStringStream
  }

  @Get("/data/:id/plainPeerReviewCollections")
  public async getPlainQuizPeerReviewCollections(
    @Param("id") quizId: string,
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

    const result = await this.quizService.getPlainQuizPeerReviewCollections(
      quizId,
    )
    const answersStringStream = result.pipe(JSONStream.stringify())

    return answersStringStream
  }

  @Get("/data/:id/plainPeerReviewQuestions")
  public async getPlainQuizPeerReviewQuestions(
    @Param("id") quizId: string,
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

    const result = await this.quizService.getPlainQuizPeerReviewQuestions(
      quizId,
    )
    const answersStringStream = result.pipe(JSONStream.stringify())

    return answersStringStream
  }

  @Get("/data/:id")
  public async getDetailedData(
    @Param("id") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Res() response: Response,
  ): Promise<any> {
    const authorized = await this.authorizationService.isPermitted({
      user,
      quizId,
      permission: Permission.EXPORT,
    })

    if (!authorized) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.quizService.getCSVData(quizId)
    return response.send(result)
  }

  @Post("/")
  public async saveQuiz(
    @EntityFromBody() quiz: Quiz,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Quiz> {
    const authorized = await this.authorizationService.isPermitted({
      user,
      courseId: quiz.courseId,
      permission: Permission.MODIFY,
    })

    if (!authorized) {
      throw new UnauthorizedError("unauthorized")
    }
    const savedQuiz = await this.quizService.saveQuiz(quiz)
    this.kafkaService.publishCourseQuizzesUpdated(quiz.courseId)
    return savedQuiz
  }

  private async getQuizzes(id: string | null, params: any): Promise<Quiz[]> {
    const query: IQuizQuery = {
      id,
      ..._.pick(params, ["courseId", "courseAbbreviation", "language"]),
      items:
        params.items === "true"
          ? true
          : params.items === "false"
          ? false
          : false,
      course:
        params.course === "true"
          ? true
          : params.course === "false"
          ? false
          : false,
      options:
        params.options === "true"
          ? true
          : params.options === "false"
          ? false
          : false,
      peerreviews:
        params.peerreviews === "true"
          ? true
          : params.peerreviews === "false"
          ? false
          : false,
      stripped:
        params.stripped === "true"
          ? true
          : params.stripped === "false"
          ? false
          : false,
    }

    return await this.quizService.getQuizzes(query)
  }
}
