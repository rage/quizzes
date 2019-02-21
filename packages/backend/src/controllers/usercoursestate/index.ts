import { UserCourseState } from "@quizzes/common/models"
import { ITMCProfileDetails } from "@quizzes/common/types"
import { Get, HeaderParam, JsonController, Param } from "routing-controllers"
import QuizAnswerService from "services/quizanswer.service"
import UserCourseStateService from "services/usercoursestate.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/usercoursestate")
export class UserCourseStateController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private userCourseStateService: UserCourseStateService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Get("/:courseId")
  public async get(
    @Param("courseId") courseId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    let userCourseState: UserCourseState = await this.userCourseStateService.getUserCourseState(
      user.id,
      courseId,
    )
    if (!userCourseState) {
      userCourseState = await this.userCourseStateService.createUserCourseState(
        this.entityManager,
        user.id,
        courseId,
      )
    }
    return userCourseState
  }

  @Get("/:courseId/required-actions")
  public async getRequiredActions(
    @Param("courseId") courseId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    return await this.userCourseStateService.getRequiredActions(
      user.id,
      courseId,
    )
  }
}
