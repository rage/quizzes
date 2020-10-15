import { EditCoursePayloadFields } from "./../types/index"
import Model from "./base_model"
import Course from "./course"

class CourseTranslation extends Model {
  languageId!: string
  title!: string
  body!: string
  abbreviation!: string

  static get tableName() {
    return "course_translation"
  }

  static get idColumn() {
    return ["course_id", "language_id"]
  }

  static relationMappings = {
    course: {
      relation: Model.HasOneRelation,
      modelClass: Course,
      join: {
        from: "course_translation.course_id",
        to: "course.id",
      },
    },
  }

  static async getById(id: string) {
    return await this.query().findOne({
      course_id: id,
    })
  }

  /**
   * updates the properties of the course included in the payload
   * @param id
   * @param payload
   */
  static async updateCourseProperties(
    id: string,
    payload: EditCoursePayloadFields,
  ) {
    const courseTranslation = await this.getById(id)
    return await courseTranslation.$query().patchAndFetch(payload)
  }
}

export default CourseTranslation
