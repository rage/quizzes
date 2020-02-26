import { Container, Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { v4 as uuidv4 } from "uuid"
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
    const newCourseId = uuidv4()

    await this.entityManager.transaction(async manager => {
      // 1. create the course

      const builder = Knex({ client: "pg" })

      console.log("New created: ", newCourseId)

      // 1. Create the quiz

      const initialQuery = builder("course").insert({
        id: newCourseId,
      })

      await manager.query(initialQuery.toQuery())

      // 2. create the translation. Expects that each course only has one translation!

      let query = builder("course_translation").insert({
        course_id: newCourseId,
        language_id: courseToBeDuplicated.texts[0].languageId,
        abbreviation: slug,
        title: name,
      })
      await manager.query(query.toQuery())

      console.log("New course has been created")

      query = builder("course_language").insert({
        course_id: newCourseId,
        language_id: courseToBeDuplicated.texts[0].languageId,
      })
      await manager.query(query.toQuery())

      // 3. Insert duplicate quizzes and quiz translations

      console.log("Starting to insert the quiz info")

      let rawQuery = builder.raw(
        `
        INSERT INTO quiz
          (id, course_id, part, section, points, deadline,
          open, excluded_from_score, auto_confirm, tries, tries_limited,
          award_points_even_if_wrong)

        SELECT
          uuid_generate_v5(:newCourseId, id::text), :newCourseId, part, section, points, deadline,
          open, excluded_from_score, auto_confirm, tries, tries_limited,
          award_points_even_if_wrong
         
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

      console.log("Inserted the quiz info!")

      // 4. Insert duplicate items and their translations

      rawQuery = builder.raw(
        `
        INSERT INTO quiz_item
          (id, quiz_id, type, "order", validity_regex, format_regex, multi, min_words, max_words, max_value, min_value)

        SELECT
          uuid_generate_v5(:newCourseId, id::text), uuid_generate_v5(:newCourseId, quiz_id::text), type,
          "order", validity_regex, format_regex, multi, min_words, max_words, max_value, min_value

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
        (quiz_item_id, language_id, title, body, success_message, failure_message, min_label, max_label)
      SELECT
        uuid_generate_v5(:newCourseId, quiz_item_id::text), language_id, title,
        body, success_message, failure_message, min_label, max_label
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

      console.log("inserted the quiz item info!")

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

      console.log("inserted the quiz option info!")

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
}

export default CourseService
