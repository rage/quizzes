import Model from "./base_model"
import Quiz from "./quiz"
import CourseTranslation from "./course_translation"
import { v4 } from "uuid"
import knex from "../../database/knex"
import stringify from "csv-stringify"

class Course extends Model {
  moocfiId!: string
  minPeerReviewsGiven!: number
  minPeerReviewsReceived!: number
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
    const texts = course.texts[0]
    course.languageId = texts.languageId
    course.title = texts.title
    course.body = texts.body
    course.abbreviation = texts.abbreviation
    delete course.texts
    return course
  }

  static async getById(id: string) {
    return await this.query()
      .withGraphJoined("texts")
      .where("id", id)
  }

  static async getAll() {
    const courses = await this.query().withGraphJoined("texts")
    return courses.map(course => {
      const text = course.texts[0]
      course.languageId = text.languageId
      course.title = text.title
      course.body = text.body
      course.abbreviation = text.abbreviation
      delete course.texts
      return course
    })
  }

  static async duplicateCourse(
    oldCourseId: string,
    name: string,
    abbreviation: string,
    language_id: string,
  ) {
    const courseToBeDuplicated = await Course.getFlattenedById(oldCourseId)
    if (!courseToBeDuplicated) {
      return null
    }

    const newCourseId = v4()

    await knex
      .transaction(async trx => {
        await trx("course").insert({ id: newCourseId })

        await trx("course_translation").insert({
          course_id: newCourseId,
          language_id: language_id,
          abbreviation,
          title: name,
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
      FROM peer_review_question WHERE quiz_id IN (
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
      INSERT INTO peer_review_question_translation (peer_review_question_id, language_id, title, body)
      SELECT uuid_generate_v5(:newCourseId, peer_review_question_id::text), :language_id, title, body
      FROM peer_review_question_translation WHERE peer_review_question_id IN (
        SELECT id FROM peer_review_question WHERE quiz_id IN (
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
      })
      .catch(e => {
        throw new Error(e)
      })

    return this.getCorrespondanceFile(oldCourseId, newCourseId)
  }

  static async getCorrespondanceFile(oldCourseId: string, newCourseId: string) {
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

  static async getAllLanguages() {
    return await knex.from("language").select("id", "name")
  }
}

export default Course
