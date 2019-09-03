import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  QueryParam,
  UnauthorizedError,
} from "routing-controllers"
import AuthorizationService, {
  Permission,
} from "services/authorization.service"
import CourseService from "services/course.service"
import UserCourseRoleService from "services/usercourserole.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { Course } from "../../models"
import { ICourseQuery, ITMCProfileDetails } from "../../types"

@JsonController(`${API_PATH}/courses`)
export class CourseController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private courseService: CourseService

  @Inject()
  private authorizationService: AuthorizationService

  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @Get("/")
  public async getall(
    @QueryParam("language") language: string,
    @QueryParam("attentionAnswers") attentionAnswers: boolean,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Course[]> {
    // We could check what courses the user is authorized to view, and then send only those courses...
    const roles = await this.userCourseRoleService.getUserCourseRoles(user.id)

    if (!roles || roles.length < 1) {
      if (!user.administrator) {
        throw new UnauthorizedError("unauthorized")
      }
    }

    const query: ICourseQuery = {
      id: null,
      language,
      attentionAnswers,
    }

    const courses = await this.courseService.getCourses(query)
    if (user.administrator) {
      return courses
    }

    return courses.filter(c => roles.some(r => r.courseId === c.id))
  }

  @Get("/:id")
  public async getOne(
    @Param("id") id: string,
    @QueryParam("language") language: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Course[]> {
    const authorized = await this.authorizationService.isPermitted({
      user,
      courseId: id,
      permission: Permission.VIEW,
    })

    if (!authorized) {
      throw new UnauthorizedError("unauthorized")
    }

    const query: ICourseQuery = {
      id,
      language,
    }

    return await this.courseService.getCourses(query)
  }
}
