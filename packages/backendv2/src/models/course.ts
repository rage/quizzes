import Knex from "knex"
import { v4 } from "uuid"
import { BadRequestError, NotFoundError } from "./../util/error"
import stringify from "csv-stringify"
import Model from "./base_model"
import Quiz from "./quiz"
import Language from "./language"
import CourseTranslation from "./course_translation"
import knex from "../../database/knex"

class Course extends Model {
  id!: string
  moocfiId!: string
  minPeerReviewsGiven!: number
  minPeerReviewsReceived!: number
  maxSpamFlags!: number
  maxReviewSpamFlags!: number
  minReviewAverage!: number
  texts!: CourseTranslation[]
  languageId!: string
  title!: string
  body!: string
  abbreviation!: string

  static get tableName() {
    return "course"
  }

  static relationMappings = {
    quizzes: {
      relation: Model.HasManyRelation,
      modelClass: Quiz,
      join: {
        from: "course.id",
        to: "quiz.course_id",
      },
    },
    texts: {
      relation: Model.HasManyRelation,
      modelClass: CourseTranslation,
      join: {
        from: "course.id",
        to: "course_translation.course_id",
      },
    },
  }

  static async getFlattenedById(id: string) {
    const courses = await this.query()
      .withGraphJoined("texts")
      .where("id", id)
      .limit(1)
    const course = courses[0]

    // validate course
    if (!course) {
      throw new NotFoundError(`course not found: ${id}`)
    }

    const texts = course.texts[0]
    course.languageId = texts.languageId
    course.title = texts.title
    course.body = texts.body
    course.abbreviation = texts.abbreviation
    delete course.texts
    return course
  }

  static async getById(id: string, trx?: Knex.Transaction) {
    return this.moveTextsToParent(
      (
        await this.query(trx)
          .withGraphJoined("texts")
          .where("id", id)
      )[0],
    )
  }

  static async getAll() {
    const courses = await this.query().withGraphJoined("texts")
    return courses.map(course => this.moveTextsToParent(course))
  }

  private static moveTextsToParent(course: any) {
    const text = course.texts[0]
    course.languageId = text.languageId
    course.title = text.title
    course.body = text.body
    course.abbreviation = text.abbreviation
    delete course.texts
    return course
  }

  static async duplicateCourse(
    oldCourseId: string,
    name: string,
    abbreviation: string,
    language_id: string,
  ) {
    // validate old course id corresponds to existing course
    let oldCourse
    try {
      oldCourse = await Course.getFlattenedById(oldCourseId)
    } catch (error) {
      throw error
    }

    // provide fallback for course name if one is not provided
    const newCourseTitle =
      name ?? `${oldCourse.title} (duplicate) [title not set]`

    // default abbreviation to course name if one is not provided
    const newCourseAbbreviation = abbreviation ?? newCourseTitle

    // ensure language id exists in the db
    const existingLanguages = await Language.getAll()

    const isLanguageIdinExistingIds = existingLanguages.some(
      (language: any) => language.id === language_id,
    )

    if (!isLanguageIdinExistingIds) {
      throw new BadRequestError(`Invalid language id provided: ${language_id}`)
    }

    const newCourseId = v4()

    await knex
      .transaction(async trx => {
        await trx("course").insert({ id: newCourseId })

        await trx("course_translation").insert({
          course_id: newCourseId,
          language_id: language_id,
          abbreviation: newCourseAbbreviation,
          title: newCourseTitle,
        })

        await trx("course_language").insert({
          course_id: newCourseId,
          language_id: language_id,
        })

        await trx.raw(
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

        await trx.raw(
          `
        INSERT INTO quiz_translation
          (quiz_id, language_id, title, body, submit_message)
        SELECT
          uuid_generate_v5(:newCourseId, quiz_id::text), :language_id, title, body, submit_message
        FROM quiz_translation WHERE quiz_id in (SELECT id FROM quiz WHERE course_id  = :oldCourseId);`,
          {
            newCourseId,
            oldCourseId,
            language_id,
          },
        )

        await trx.raw(
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

        await trx.raw(
          `
      INSERT INTO quiz_item_translation
        (quiz_item_id, language_id, title, body, success_message, failure_message, min_label, max_label)
      SELECT
        uuid_generate_v5(:newCourseId, quiz_item_id::text), :language_id, title,
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
            language_id,
          },
        )

        await trx.raw(
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

        await trx.raw(
          `
      INSERT INTO quiz_option_translation
        (quiz_option_id, language_id, title, body, success_message, failure_message)
      SELECT
        uuid_generate_v5(:newCourseId, quiz_option_id::text), :language_id, title, body, success_message, failure_message
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
            language_id,
          },
        )

        await trx.raw(
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

        await trx.raw(
          `
      INSERT INTO peer_review_collection_translation (peer_review_collection_id, language_id, title, body)
      SELECT uuid_generate_v5(:newCourseId, peer_review_collection_id::text), :language_id, title, body
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
            language_id,
          },
        )

        await trx.raw(
          `
      INSERT INTO peer_review_question (id, quiz_id, peer_review_collection_id,
        "default", type, answer_required, "order")
      SELECT uuid_generate_v5(:newCourseId, id::text), uuid_generate_v5(:newCourseId, quiz_id::text),
        uuid_generate_v5(:newCourseId, peer_review_collection_id::text),
        "default", type, answer_required, "order"
      FROM peer_review_question WHERE peer_review_collection_id IN (
        SELECT id
        FROM peer_review_collection
        WHERE quiz_id IN (
          SELECT id
          FROM quiz
          WHERE course_id = :oldCourseId
        )
      );
      `,
          {
            newCourseId,
            oldCourseId,
          },
        )

        await trx.raw(
          `
      INSERT INTO peer_review_question_translation (peer_review_question_id, language_id, title, body)
      SELECT uuid_generate_v5(:newCourseId, peer_review_question_id::text), :language_id, title, body
      FROM peer_review_question_translation WHERE peer_review_question_id IN (
        SELECT id
        FROM peer_review_question WHERE peer_review_collection_id IN (
          SELECT id
          FROM peer_review_collection
          WHERE quiz_id IN (
            SELECT id
            FROM quiz
            WHERE course_id = :oldCourseId
          )
        )
      );
      `,
          {
            newCourseId,
            oldCourseId,
            language_id,
          },
        )
      })
      .catch(e => {
        throw new Error(e)
      })

    return { success: true, newCourseId: newCourseId }
  }

  static async getCorrespondenceFile(oldCourseId: string, newCourseId: string) {
    const stringifier = stringify({
      delimiter: " ",
    })

    const stream = knex
      .raw(
        `
      SELECT id AS old_id, uuid_generate_v5(:newCourseId, id::text) AS new_id
      FROM quiz
      WHERE course_id = :oldCourseId
      `,
        {
          newCourseId: newCourseId,
          oldCourseId: oldCourseId,
        },
      )
      .stream()
      .pipe(stringifier)

    return stream
  }

  public static async getParts(courseId: string) {
    return (
      await Quiz.query()
        .distinct("part")
        .where({ course_id: courseId })
        .andWhereNot("part", 0)
    ).map(q => q.part)
  }

  static async updateMoocfiId(id: string, newMoocfiId: string) {
    let course
    try {
      course = await this.query().patchAndFetchById(id, {
        moocfiId: newMoocfiId,
      })
    } catch (error) {
      throw error
    }

    return course.moocfiId
  }
}

export default Course
