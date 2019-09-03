import { Inject, Service } from "typedi"
import { InjectManager } from "typeorm-typedi-extensions"
import { EntityManager } from "typeorm"
import { ITMCProfileDetails, IAuthorizationQuery } from "../types"
import QuizService from "./quiz.service"
import QuizAnswerService from "./quizanswer.service"
import UserCourseRoleService from "./usercourserole.service"

// Order can be used to quickly solve issues of sufficient authorization
export enum Permission {
  VIEW = 0,
  GRADE = 1,
  EXPORT = 2,
  MODIFY = 3,
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
      if (quizId) {
        const quizzes = await this.quizService.getQuizzes({
          stripped: true,
          id: quizId,
        })

        if (quizzes.length === 0) {
          return false
        }

        courseId = quizzes[0].courseId
      } else if (answerId) {
        const answer = await this.quizAnswerService.getAnswer(
          { id: answerId },
          this.entityManager,
        )
        courseId = answer.quiz.courseId
      }
    }

    const roles = await this.userCourseRoleService.getUserCourseRoles(
      user.id,
      courseId,
    )

    if (roles.some(r => r.role === "teacher")) {
      return true
    }
    if (
      roles.some(r => r.role === "assistant") &&
      permission <= Permission.GRADE
    ) {
      return true
    }

    return false
  }
}