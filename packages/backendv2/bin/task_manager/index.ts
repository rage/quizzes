import knex from "../../database/knex"
import { Model, snakeCaseMappers } from "objection"
import reEvaluate from "../re_evaluate"
import recalculate from "../recalculate"
import { sleep_ms } from "./util"
import { TaskType } from "../../src/types"
import { BackgroundTask } from "../../src/models"

Model.knex(knex)
Model.columnNameMappers = snakeCaseMappers()

export default class Manager {
  queue: BackgroundTask[] = []
  tasks: {
    [id: string]: {
      task: BackgroundTask
      cancel?: () => void
      report?: () => any
    }
  } = {}
  running: boolean = false

  constructor() {
    this.run()
  }

  async run() {
    if (this.running) {
      return
    }
    this.running = true
    while (this.running) {
      const tasks = await BackgroundTask.getAll()
      this.queue = [...this.queue, ...tasks]
      const task = this.queue.shift()
      if (task) {
        const { type, id, quizId, courseId } = task
        try {
          switch (type) {
            case TaskType.RE_EVAL:
              if (!quizId) {
                break
              }
              this.runTask(reEvaluate, task, [quizId])
              break
            case TaskType.RECALC:
              if (!courseId) {
                break
              }
              this.runTask(recalculate, task, [courseId])
              break
          }
        } catch (error) {
          console.log(error)
        }
        if (id) {
          await BackgroundTask.delete(id)
        }
      }
      await sleep_ms(100)
    }
  }

  async runTask(action: any, task: BackgroundTask, params: any[]) {
    const idString = task.quizId || task.courseId
    const id = task.type + "_" + idString
    if (id in this.tasks) {
      console.log("task already running")
      return
    }
    this.tasks[id] = { task }
    const add = (hooks: any) => {
      this.tasks[id] = { ...hooks, ...this.tasks[id] }
    }
    await action(...params, add)
    delete this.tasks[id]
  }

  stop() {
    this.running = false
    console.log("event loop stopped")
  }
  add(task: BackgroundTask) {
    this.queue.push(task)
  }
  list() {
    console.log("in queue")
    console.log(this.queue)
    console.log("in progress")
    console.log(this.tasks)
  }
  show() {
    Object.keys(this.tasks).forEach(id => {
      console.log(id + " " + this.tasks[id].report?.())
    })
  }
  cancel(id: string) {
    console.log("cancelling " + id)
    this.tasks[id].cancel?.()
    delete this.tasks[id]
  }
  cancelAll() {
    Object.keys(this.tasks).forEach(id => {
      this.cancel(id)
    })
  }
}

