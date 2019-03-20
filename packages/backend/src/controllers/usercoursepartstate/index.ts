import { Get, HeaderParam, JsonController, Param } from "routing-controllers"
import QuizService from "services/quiz.service"
import UserQuizStateService from "services/userquizstate.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { Quiz, UserQuizState } from "../../models"
import { ITMCProfileDetails } from "../../types"

@JsonController(`${API_PATH}/courses`)
export class UserCoursePartStateController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizService: QuizService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Get("/:courseId/users/current/progress")
  public async get(
    @Param("courseId") courseId: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    const quizzes: Quiz[] = await this.quizService.getQuizzes({ courseId })
    const userQuizStates: UserQuizState[] = await this.userQuizStateService.getQuizStatesForUserCourse(
      this.entityManager,
      user.id,
      quizzes.map(quiz => quiz.id),
    )
    const parts = new Set()
    quizzes.map(quiz => parts.add(quiz.part))
    // part 0 not valid
    parts.delete(0)
    const partStates: any[] = []
    parts.forEach(part => {
      const partQuizzes = quizzes.filter(quiz => quiz.part === part)
      let nPoints: number = 0
      let maxPoints: number = 0
      partQuizzes.map(quiz => {
        const userQuizState = userQuizStates.find(uqs => uqs.quizId === quiz.id)
        nPoints += userQuizState ? userQuizState.pointsAwarded : 0
        maxPoints += quiz.points
      })
      partStates.push({
        group: "osa0" + part.toString(),
        progress: Math.floor(nPoints / maxPoints),
        n_points: Number(nPoints.toFixed(2)),
        max_points: maxPoints,
      })
    })
    return { points_by_group: partStates }
  }
}
