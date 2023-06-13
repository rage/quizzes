import Knex = require("knex")
import { Container, Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { ReadStream } from "typeorm/platform/PlatformTools"
import { v4 as uuidv4 } from "uuid"
import { Course, CourseTranslation } from "../models"
import { ICourseQuery } from "../types"
import UserCourseRoleService from "./usercourserole.service"

@Service()
export class CourseService {
  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @InjectManager()
  private entityManager: EntityManager

  public async getCourses(query: ICourseQuery): Promise<Course[]> {
    const { language, id, user } = query

    const queryBuilder: SelectQueryBuilder<Course> = this.entityManager.createQueryBuilder(
      Course,
      "course",
    )

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

  public async generateQuizTransitionFile(
    newCourse: Course,
    oldCourse: Course,
  ): Promise<any> {
    const builder = Knex({ client: "pg" })
    const rawQuery = builder.raw(
      `
        SELECT id AS old_id, uuid_generate_v5(:newCourseId, id::text) AS new_id
        FROM quiz
        WHERE course_id = :oldCourseId
      `,
      {
        newCourseId: newCourse.id,
        oldCourseId: oldCourse.id,
      },
    )

    const data = this.entityManager.query(rawQuery.toQuery())
    return data
  }

  public async duplicateCourse(
    course: Course,
    name: string,
    abbreviation: string,
  ): Promise<Course> {
    const courseId = course.id

    const courseToBeDuplicated = await Course.findOne(courseId)
    if (!courseToBeDuplicated) {
      return null
    }

    const oldCourseId = courseId
    const newCourseId = uuidv4()

    await this.entityManager.transaction(async manager => {
      // 1. create the course

      const builder = Knex({ client: "pg" })

      // 1. Create the quiz

      const initialQuery = builder("course").insert({
        id: newCourseId,
      })

      await manager.query(initialQuery.toQuery())

      // 2. create the translation. Expects that each course only has one translation!

      let query = builder("course_translation").insert({
        course_id: newCourseId,
        language_id: courseToBeDuplicated.texts[0].languageId,
        abbreviation,
        title: name,
      })
      await manager.query(query.toQuery())

      query = builder("course_language").insert({
        course_id: newCourseId,
        language_id: courseToBeDuplicated.texts[0].languageId,
      })
      await manager.query(query.toQuery())

      // 3. Insert duplicate quizzes and quiz translations

      let rawQuery = builder.raw(
        `
        INSERT INTO quiz
          (id, course_id, part, section, points, deadline,
          open, excluded_from_score, auto_confirm, auto_reject, tries, tries_limited,
          award_points_even_if_wrong, grant_points_policy, check_plagiarism,
          give_max_points_when_tries_run_out)

        SELECT
          uuid_generate_v5(:newCourseId, id::text), :newCourseId, part, section, points, deadline,
          open, excluded_from_score, auto_confirm, auto_reject, tries, tries_limited,
          award_points_even_if_wrong, grant_points_policy, check_plagiarism
         
        FROM quiz WHERE course_id = :oldCourseId;
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )
      await manager.query(rawQuery.toQuery())

      rawQuery = builder.raw(
        `
        INSERT INTO quiz_translation
          (quiz_id, language_id, title, body, submit_message)
        SELECT
          uuid_generate_v5(:newCourseId, quiz_id::text), language_id, title, body, submit_message
        FROM quiz_translation WHERE quiz_id in (SELECT id FROM quiz WHERE course_id  = :oldCourseId);`,
        {
          newCourseId,
          oldCourseId,
        },
      )
      await manager.query(rawQuery.toQuery())

      // 4. Insert duplicate items and their translations

      rawQuery = builder.raw(
        `
        INSERT INTO quiz_item
          (id, quiz_id, type, "order", validity_regex, format_regex, multi, min_words, max_words, 
          max_value, min_value, uses_shared_option_feedback_message)

        SELECT
          uuid_generate_v5(:newCourseId, id::text), uuid_generate_v5(:newCourseId, quiz_id::text), type,
          "order", validity_regex, format_regex, multi, min_words, max_words, max_value, min_value,
          uses_shared_option_feedback_message

        FROM quiz_item WHERE quiz_id in (SELECT id FROM quiz WHERE course_id = :oldCourseId);`,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      rawQuery = builder.raw(
        `
      INSERT INTO quiz_item_translation
        (quiz_item_id, language_id, title, body, success_message, failure_message, min_label, max_label, 
        shared_option_feedback_message)
      SELECT
        uuid_generate_v5(:newCourseId, quiz_item_id::text), language_id, title,
        body, success_message, failure_message, min_label, max_label, shared_option_feedback_message
      FROM quiz_item_translation
        WHERE quiz_item_id in (
          SELECT id FROM quiz_item WHERE quiz_id in (
            SELECT id FROM quiz WHERE course_id = :oldCourseId
          )
        );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      // 5. Insert duplicate options and their translations

      rawQuery = builder.raw(
        `
      INSERT INTO quiz_option (id, quiz_item_id, "order", correct)
      SELECT
        uuid_generate_v5(:newCourseId, id::text), uuid_generate_v5(:newCourseId, quiz_item_id::text), "order", correct
      FROM
        quiz_option WHERE quiz_item_id in (
          SELECT id FROM quiz_item WHERE quiz_id in (
            SELECT id FROM quiz WHERE course_id = :oldCourseId
          )
        );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      rawQuery = builder.raw(
        `
      INSERT INTO quiz_option_translation
        (quiz_option_id, language_id, title, body, success_message, failure_message)
      SELECT
        uuid_generate_v5(:newCourseId, quiz_option_id::text), language_id, title, body, success_message, failure_message
      FROM
        quiz_option_translation WHERE quiz_option_id in (
          SELECT id FROM quiz_option WHERE quiz_item_id in (
            SELECT id FROM quiz_item WHERE quiz_id in (
              SELECT id FROM quiz WHERE course_id = :oldCourseId
            )
          )
        );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      // 6. Add peer review collections and their translations

      rawQuery = builder.raw(
        `
      INSERT INTO peer_review_collection (id, quiz_id)
      SELECT uuid_generate_v5(:newCourseId, id::text), uuid_generate_v5(:newCourseId, quiz_id::text)
      FROM peer_review_collection WHERE quiz_id IN (
        SELECT id FROM quiz WHERE course_id = :oldCourseId
      );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      rawQuery = builder.raw(
        `
      INSERT INTO peer_review_collection_translation (peer_review_collection_id, language_id, title, body)
      SELECT uuid_generate_v5(:newCourseId, peer_review_collection_id::text), language_id, title, body
      FROM peer_review_collection_translation
        WHERE peer_review_collection_id IN (
          SELECT id FROM peer_review_collection WHERE quiz_id IN (
            SELECT id FROM quiz WHERE course_id = :oldCourseId
          )
        );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      // 7. Add peer review questions and their translations

      rawQuery = builder.raw(
        `
      INSERT INTO peer_review_question (id, quiz_id, peer_review_collection_id,
        "default", type, answer_required, "order")
      SELECT uuid_generate_v5(:newCourseId, id::text), uuid_generate_v5(:newCourseId, quiz_id::text),
        uuid_generate_v5(:newCourseId, peer_review_collection_id::text),
        "default", type, answer_required, "order"
      FROM peer_review_question WHERE quiz_id IN (
        SELECT id FROM quiz WHERE course_id = :oldCourseId
      );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())

      rawQuery = builder.raw(
        `
      INSERT INTO peer_review_question_translation (peer_review_question_id, language_id, title, body)
      SELECT uuid_generate_v5(:newCourseId, peer_review_question_id::text), language_id, title, body
      FROM peer_review_question_translation WHERE peer_review_question_id IN (
        SELECT id FROM peer_review_question WHERE quiz_id IN (
          SELECT id FROM quiz WHERE course_id = :oldCourseId
        )
      );
      `,
        {
          newCourseId,
          oldCourseId,
        },
      )

      await manager.query(rawQuery.toQuery())
    })

    return await this.entityManager.findOne(Course, newCourseId)
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

  public async getElementsCourseIds(
    reallyCheck: boolean = false,
  ): Promise<string[]> {
    if (reallyCheck) {
      const query = `SELECT id FROM course JOIN course_translation 
    ON course.id = course_translation.course_id
    WHERE course_translation.abbreviation LIKE '%elements-of-ai%';`

      const result = await this.entityManager.query(query)
      console.log("Result: ", result)
      return result.map((e: any) => e.id)
    } else {
      return [
        "21356a26-7508-4705-9bab-39b239862632",
        "5d1e8da2-3154-4966-aa94-2ca0406cf38a",
        "5f496ecc-327a-4899-baff-2daa2b40b05f",
        "5bbd7d17-3099-48cb-a8c2-2bf70d0ea375",
        "5bfa04ac-30b9-49d9-a171-2c140f11f9a7",
      ]
    }
  }
}

export default CourseService
