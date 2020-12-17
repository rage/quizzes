import QuizAnswer from "./quiz_answer"
import UserQuizState from "./user_quiz_state"
import Knex from "knex"
import BaseModel from "./base_model"

class BackgroundTask extends BaseModel {
  id!: string
  type!: string
  dependsOn!: string
  quizId!: string
  courseId!: string

  static get tableName() {
    return "background_task"
  }

  /*static relationMappings = {
    dependency: {
      relation: BaseModel.HasOneRelation,
      modelClass: BackgroundTask,
      join: {
        from: "background_task.id",
        to: "background_task.depends_on",
      },
    },
    dependent: {
      relation: BaseModel.HasOneRelation,
      modelClass: BackgroundTask,
      join: {
        from: "background_task.depends_on",
        to: "background_task.id"        
      }
    }
  }*/

  public static async getOne() {
    return (
      (
        await this.query()
          //.withGraphJoined("dependency")
          .orderBy("depends_on")
          .limit(1)
      )[0]
    )
  }

  public static async getAll(): Promise<BackgroundTask[]> {
    return await this.query()
  }

  public static async getById(id: string) {
    return (await this.query().where("id", id))[0]
  }

  public static async delete(id: string) {
    await this.query()
      .where("id", id)
      .del()
  }
}

export default BackgroundTask
