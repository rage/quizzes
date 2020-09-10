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

  static async updateCourseTitle(id: string, newTitle: string) {
    const courseTranslation = await this.getById(id)
    return await courseTranslation.$query().patchAndFetch({ title: newTitle })
  }

  static async updateCourseAbbreviation(id: string, newAbbreviation: string) {
    const courseTranslation = await this.getById(id)
    return await courseTranslation
      .$query()
      .patchAndFetch({ abbreviation: newAbbreviation })
  }
}

export default CourseTranslation
