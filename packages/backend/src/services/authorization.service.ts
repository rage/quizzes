import { Inject, Service } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { IAuthorizationQuery } from "../types"
import QuizService from "./quiz.service"
import QuizAnswerService from "./quizanswer.service"
import UserCourseRoleService from "./usercourserole.service"

// Order can be used to quickly solve issues of sufficient authorization
export enum Permission {
  VIEW = 0,
  GRADE = 1,
  MODIFY = 2,
  EXPORT = 3,
}

@Service()
export default class AuthorizationService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @Inject()
  private quizService: QuizService

  @Inject()
  private quizAnswerService: QuizAnswerService

  public isPermitted = async ({
    user,
    answerId,
    courseId,
    quizId,
    permission,
  }: IAuthorizationQuery) => {
    if (user.administrator) {
      return true
    }
    if (!courseId && !quizId && !answerId) {
      return false
    }
    if (!courseId) {
      if (answerId) {
        const answer = await this.quizAnswerService.getAnswer(
          { id: answerId },
          this.entityManager,
        )
        quizId = answer.quizId
      }

      const quizzes = await this.quizService.getQuizzes({
        stripped: true,
        id: quizId,
      })

      if (quizzes.length === 0) {
        return false
      }

      courseId = quizzes[0].courseId
    }

    const roles = await this.userCourseRoleService.getUserCourseRoles({
      userId: user.id,
      courseId,
    })

    if (roles.some(r => r.role === "teacher")) {
      return true
    }
    if (
      roles.some(r => r.role === "assistant") &&
      permission <= Permission.EXPORT
    ) {
      return true
    }

    return false
  }
}
