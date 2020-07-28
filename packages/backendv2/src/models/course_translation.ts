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
}

export default CourseTranslation
