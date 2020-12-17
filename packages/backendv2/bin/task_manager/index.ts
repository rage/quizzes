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
  running: { [type: string]: any } = {
    recalculate: undefined,
    re_evaluate: undefined,
    broadcast: undefined,
  }

  constructor() {
    this.start()
  }

  async start() {
    if (this.running) {
      return
    }
    this.running = true
    while (this.slotsAvalable()) {
      if (this.queue.length > 0) {
        const task = this.queue.shift()
        if (task) {
          this.run(task)
        }
        continue
      }
      let task = await BackgroundTask.getOne()
      let { dependsOn } = task

      while (dependsOn) {
        const dependency = await BackgroundTask.getById(dependsOn)
        if (!dependency) {
          break
        }
        task = dependency
        dependsOn = task.dependsOn
      }
      console.log(task)

      this.queue.push(task)

      break
      await sleep_ms(100)
    }
  }

  async run(task: BackgroundTask) {
    const { id, type, dependsOn, quizId, courseId } = task
    if (dependsOn) {
      BackgroundTask.getById
    }
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
      // await BackgroundTask.delete(id)
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

  slotsAvalable() {
    return Object.values(this.running).some(task => task === undefined)
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

new Manager()
