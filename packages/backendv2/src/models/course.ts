import { Model } from "objection"
import Quiz from "./quiz"
import CourseTranslation from "./course_translation"

class Course extends Model {
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
}

export default Course
