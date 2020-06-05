import { Model } from "objection"
import Course from "./course"

class CourseTranslation extends Model {
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
