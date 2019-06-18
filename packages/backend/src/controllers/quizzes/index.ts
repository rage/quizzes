import { Response } from "express"
import JSONStream from "JSONStream"
import { getUUIDByString } from "@quizzes/common/util"
import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  Post,
  QueryParams,
  Res,
  UnauthorizedError,
} from "routing-controllers"
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserQuizStateService from "services/userquizstate.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import validator from "validator"
import { API_PATH } from "../../config"
import {
  PeerReviewCollection,
  Quiz,
  QuizAnswer,
  UserQuizState,
} from "../../models"
import { IQuizQuery, ITMCProfileDetails } from "../../types"
import _ from "lodash"

@JsonController(`${API_PATH}/quizzes`)
export class QuizController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private peerReviewService: PeerReviewService

  @Inject()
  private quizService: QuizService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Get("/")
  public async getAll(@QueryParams() params: string[]): Promise<Quiz[]> {
    return await this.getQuizzes(null, params)
  }

  @Get("/:id")
  public async get(
    @Param("id") id: string,
    @QueryParams() params: any,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    try {
      const quizId = validator.isUUID(id) ? id : getUUIDByString(id)

      let userQuizState: UserQuizState
      try {
        userQuizState = await this.userQuizStateService.getUserQuizState(
          user.id,
          quizId,
        )
      } catch (error) {
        console.log("not found")
      }
      let quizAnswer: QuizAnswer
      if (userQuizState) {
        const answer = await this.quizAnswerService.getAnswer(
          { quizId, userId: user.id },
          this.entityManager,
        )
        if (answer.status === "submitted" || answer.status === "confirmed") {
          quizAnswer = answer
        }
      }
      const quizzes: Quiz[] = await this.quizService.getQuizzes({
        id: quizId,
        items: true,
        options: true,
        peerreviews: true,
        course: true,
        stripped: quizAnswer ? false : true,
        ...params,
      })
      return {
        quiz: quizzes[0],
        quizAnswer,
        userQuizState,
      }
    } catch (error) {}
  }

  /* Was not able to figure out multiple streams to one request... maybe come back later(?)



  @Get("/data/:id/all")
  public async getSheetsOfData(
    @Param("id") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Res() response  : Response
  ){

    console.time("whole")


    const answersResult = await this.quizAnswerService.getCSVData(quizId)
    const answersStringStream = answersResult.pipe(JSONStream.stringify())



    const peerReviewsResult = await this.peerReviewService.getCSVData(quizId)
    const peerReviewsStringStream = peerReviewsResult.pipe(JSONStream.stringify())
  




    // const quizData = await this.quizService.getCSVData(quizId)


    return answersStringStream

   return  response.end()

    console.timeEnd("whole")
    return [
     answersStringStream,
      peerReviewsStringStream
    ]

  }
  */

  @Get("/data/:id")
  public async getDetailedData(
    @Param("id") quizId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Res() response: Response,
  ) {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const result = await this.quizService.getCSVData(quizId)
    return response.send(result)
  }

  @Post("/")
  public async post(
    @EntityFromBody() quiz: Quiz,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Quiz> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }
    return await this.quizService.createQuiz(quiz)
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
