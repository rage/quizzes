import { Course, CourseTranslation } from "@quizzes/common/models"
import { ICourseQuery } from "@quizzes/common/types"
import { Get, JsonController, Param, QueryParam } from "routing-controllers"
import CourseService from "services/course.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/courses")
export class CourseController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private courseService: CourseService

  @Get("/")
  public async getall(
    @QueryParam("language") language: string,
  ): Promise<Course[]> {
    const query: ICourseQuery = {
      id: null,
      language,
    }
    return await this.courseService.getCourses(query)
  }

  @Get("/:id")
  public async getOne(
    @Param("id") id: string,
    @QueryParam("language") language: string,
  ): Promise<Course[]> {
    const query: ICourseQuery = {
      id,
      language,
    }

    return await this.courseService.getCourses(query)
  }
}
