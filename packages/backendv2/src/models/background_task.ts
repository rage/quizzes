import QuizAnswer from "./quiz_answer"
import UserQuizState from "./user_quiz_state"
import Knex from "knex"
import BaseModel from "./base_model"

class BackgroundTask extends BaseModel {
  id!: string
  type!: string
  quizId!: string
  courseId!: string

  static get tableName() {
    return "background_task"
  }

  public static async getAll(): Promise<BackgroundTask[]> {
    return await this.query()
  }

  public static async delete(id: string) {
    await this.query()
      .where("id", id)
      .del()
  }
}

export default BackgroundTask
