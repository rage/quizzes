import { Container, Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { Course } from "../models"
import { ICourseQuery } from "../types"
import UserCourseRoleService from "./usercourserole.service"
import Knex = require("knex")

@Service()
export class CourseService {
  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @InjectManager()
  private entityManager: EntityManager

  public async getCourses(query: ICourseQuery): Promise<Course[]> {
    const { language, id, user } = query

    const queryBuilder: SelectQueryBuilder<
      Course
    > = this.entityManager.createQueryBuilder(Course, "course")

    if (user && !user.administrator) {
      const roles = await this.userCourseRoleService.getUserCourseRoles({
        userId: user.id,
      })
      const allowedCourseIds = [...new Set(roles.map(r => r.courseId))]

      // if id defined it will override - but that's fine
      queryBuilder.where("course.id IN (:...ids)", { ids: allowedCourseIds })
    }
    queryBuilder.leftJoinAndSelect("course.texts", "course_translation")

    if (id) {
      queryBuilder.where("course.id = :id", { id })
    }

    if (language) {
      queryBuilder
        .leftJoinAndSelect("course.languages", "language")
        .andWhere("language.id = :language", { language })
    }

    return await queryBuilder
      .getMany()
      .then(
        async (courses: Course[]) =>
          await Promise.all(
            courses.map(async (c: Course) => this.stripCourse(c, query)),
          ),
      )
  }

  public async duplicateCourse(
    courseId: string,
    name: string,
    slug: string,
  ): Promise<Course> {
    // 1. check if the course exists

    const courseToBeDuplicated = await Course.findOne(courseId)
    if (!courseToBeDuplicated) {
      return null
    }

    // 2. knex together the thingies

    const oldCourseId = courseId

    this.entityManager.transaction(async manager => {
      const newCourse = await manager.create(Course)

      const builder = Knex({ client: "pg" })

      builder("course_translation").insert({
        course_id: "",
        language_id: "",
        abbreviation: slug,
        title: title,
      })
    })

    // return the course

    return null
  }

  private async stripCourse(
    course: Course,
    query: ICourseQuery,
  ): Promise<Course> {
    await course.languages
    await course.texts

    if (query.language) {
      course.texts = course.texts.filter(t => t.languageId === query.language)
    }

    return await course
  }
}

export default CourseService
