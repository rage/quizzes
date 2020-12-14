import knex from "../../database/knex"
import { Model, snakeCaseMappers } from "objection"
import reEvaluate from "../re_evaluate"
import { sleep_ms } from "./util"

Model.knex(knex)
Model.columnNameMappers = snakeCaseMappers()

interface Task {
  type: TaskType
  id?: string
  quizId?: string
}

enum TaskType {
  RE_EVAL = "re_eval",
}

export default class Manager {
  queue: Task[] = []
  tasks: {
    [id: string]: { task: Task; cancel?: () => void; report?: () => number }
  } = {}
  running: boolean = false

  async run() {
    if (this.running) {
      return
    }
    this.running = true
    while (this.running) {
      ;(await knex("background_task").select()).forEach(t => {
        const { quiz_id, ...rest } = t
        const task = { quizId: quiz_id, ...rest }
        this.queue.push(task)
      })
      while (this.queue.length > 0) {
        const task = this.queue.shift()
        if (!task) {
          break
        }
        const { type, id, quizId } = task
        try {
          switch (type) {
            case TaskType.RE_EVAL:
              if (!quizId) {
                break
              }
              this.runTask(task, reEvaluate, [quizId])
              break
          }
        } catch (error) {
          // console.log(error)
        }
        if (id) {
          await knex("background_task")
            .where("id", id)
            .del()
        }
      }
      await sleep_ms(1000)
    }
  }

  runTask(task: Task, action: any, params: any[]) {
    const id = task.type + "_" + task.quizId
    if (id in this.tasks) {
      console.log("task already running")
      return
    }
    this.tasks[id] = { task }
    const add = (hooks: any) => {
      this.tasks[id] = { ...hooks, ...this.tasks[id] }
    }
    return action(...params, add)
  }

  stop() {
    this.running = false
    console.log("event loop stopped")
  }
  add(task: Task) {
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

/*
const manager = new Manager()
manager.run()
manager.add({
  type: "re_eval",
  quiz_id: "2718851a-f8d6-404e-8acb-c7eca1ba0b9c",
  // quiz_id: "6fb9b7cf-471c-45ca-b3fd-392214260eeb",
  // quiz_id: "48a56234-e92d-541f-b333-8f17fd01fb99"
})
*/

/*
const manager = new Manager()
manager.run()
manager.list()
manager.cancel(1)
manager.run()
manager.add({
  type: "re_eval",
  quiz_id: "2718851a-f8d6-404e-8acb-c7eca1ba0b9c"
  // quiz_id: "6fb9b7cf-471c-45ca-b3fd-392214260eeb",
  // quiz_id: "48a56234-e92d-541f-b333-8f17fd01fb99"
})
manager.add({
  type: "re_eval",
  // quiz_id: "2718851a-f8d6-404e-8acb-c7eca1ba0b9c"
  quiz_id: "6fb9b7cf-471c-45ca-b3fd-392214260eeb",
  // quiz_id: "48a56234-e92d-541f-b333-8f17fd01fb99"
})
*/
