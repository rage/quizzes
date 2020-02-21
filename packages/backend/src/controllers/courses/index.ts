import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  QueryParam,
  UnauthorizedError,
  Post,
  Body,
} from "routing-controllers"
import AuthorizationService, {
  Permission,
} from "services/authorization.service"
import CourseService from "services/course.service"
import UserCourseRoleService from "services/usercourserole.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
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
    const roles = await this.userCourseRoleService.getUserCourseRoles({
      userId: user.id,
    })

    if (!roles || roles.length < 1) {
      if (!user.administrator) {
        throw new UnauthorizedError("unauthorized")
      }
    }

    const query: ICourseQuery = {
      id: null,
      language,
      attentionAnswers,
      user,
    }

    const courses = await this.courseService.getCourses(query)

    if (user.administrator) {
      return courses
    }

    const courseIdsForAllRoles = new Set(roles.map(r => r.courseId))
    return courses.filter(course => courseIdsForAllRoles.has(course.id))
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

  @Post("/:id/duplicate")
  public async duplicateCourse(
    @Param("id") id: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
    @Body() names: { title: string; slug: string },
  ): Promise<any> {
    const authorized = await this.authorizationService.isPermitted({
      user,
      courseId: id,
      permission: Permission.DUPLICATE,
    })

    if (!authorized) {
      throw new UnauthorizedError("unauthorized")
    }

    const { title, slug } = names
    const result = this.courseService.duplicateCourse(id, title, slug)
    if (!result) {
      return "Failed for some reason"
    }
    return `You sent ${title}, ${slug}`
  }
}
