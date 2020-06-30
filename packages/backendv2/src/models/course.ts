import Model from "./base_model"
import Quiz from "./quiz"
import CourseTranslation from "./course_translation"

class Course extends Model {
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
}

export default Course
