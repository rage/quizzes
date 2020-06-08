import Model from "./base_model"
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
  static async getAll() {
    return await this.query().withGraphJoined("texts")
  }
}

export default Course
