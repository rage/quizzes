import QuizAnswer from "./quiz_answer"
import UserQuizState from "./user_quiz_state"
import Knex from "knex"
import BaseModel from "./base_model"
import recalculate from "../../bin/recalculate"
import reEvaluate from "../../bin/re_evaluate"

class BackgroundTask extends BaseModel {
  id!: string
  type!: string
  dependsOn!: string
  quizId!: string
  courseId!: string
  taskImpl!: () => Promise<any>

  constructor() {
    super()
    const taskImpls: { [type: string]: any } = {
      reEvaluate: (cb: () => any) => reEvaluate(this.quizId, cb),
      recalculate: (cb: () => any) => recalculate(this.courseId, cb),
      broadcast: () => {},
    }
    this.taskImpl = taskImpls[this.type]
  }

  static get tableName() {
    return "background_task"
  }

  public async run() {
    console.log("running: " + this.type + " " + this.id)
    await this.taskImpl()
    /*const f = () => {
       return new Promise(resolve => {
        setTimeout(() => resolve(""), 600)
       })
    }
    console.log("running: " + this.type + " " + this.id)
    await f()*/
  }

  public static async getOne() {
    return (
      await this.query()
        .orderBy("depends_on")
        .limit(1)
    )[0]
  }

  public static async getAll(): Promise<BackgroundTask[]> {
    return await this.query()
  }

  public static async getById(id: string) {
    return (await this.query().where("id", id))[0]
  }

  public static async getByType(type: string) {
    return (
      await this.query()
        .where("type", type)
        .orderBy("created_at")
        .limit(1)
    )[0]
  }

  public static async delete(id: string) {
    await this.query()
      .where("id", id)
      .del()
  }
}

export default BackgroundTask
