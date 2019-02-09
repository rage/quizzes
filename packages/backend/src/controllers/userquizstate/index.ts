import {
  PeerReview,
  Quiz,
  QuizAnswer,
  SpamFlag,
  UserQuizState,
} from "@quizzes/common/models"
import {
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  QueryParam,
  QueryParams,
} from "routing-controllers"
import PeerReviewService from "services/peerreview.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import SpamFlagService from "services/spamflag.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/usercoursestate")
export class UserCourseStateController {
  @Get("/:userId/:courseId")
  public async get(
    @Param("userId") userId: number,
    @Param("courseId") courseId: string,
  ) {
    console.log(userId)
    console.log(courseId)
    return ""
  }
}
