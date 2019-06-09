import {
  Get,
  HeaderParam,
  JsonController,
  Param,
  QueryParam,
  UnauthorizedError,
} from "routing-controllers"
import CourseService from "services/course.service"
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

  @Get("/")
  public async getall(
    @QueryParam("language") language: string,
    @QueryParam("attentionAnswers") attentionAnswers: boolean,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Course[]> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const query: ICourseQuery = {
      id: null,
      language,
      attentionAnswers,
    }

    return await this.courseService.getCourses(query)
  }

  @Get("/:id")
  public async getOne(
    @Param("id") id: string,
    @QueryParam("language") language: string,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<Course[]> {
    if (!user.administrator) {
      throw new UnauthorizedError("unauthorized")
    }

    const query: ICourseQuery = {
      id,
      language,
    }

    return await this.courseService.getCourses(query)
  }
}
