import knex from "../../database/knex"
import { Model, snakeCaseMappers } from "objection"
import Multiprogress from "multi-progress"
import reEvaluate from "../re_evaluate"
import { v4 as uuidv4 } from "uuid"

Model.knex(knex)
Model.columnNameMappers = snakeCaseMappers()

export const sleep_ms = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("")
    }, ms)
  })
}

export class Manager {
  // WHY NO PRIVATE???
  private queue: any[] = []
  // private tasksRunning: any[] = []
  private tasks: { [id: string]: any } = {}
  private running: boolean = false
  private progress = new Multiprogress()
  async run() {
    if (this.running) {
      return
    }

    this.running = true
    ;(async () => {
      while (this.running) {
        ;(await knex("background_task").select()).forEach(task =>
          this.queue.push(task),
        )
        while (this.queue.length > 0) {
          const task = this.queue.shift()
          try {
            switch (task.type) {
              case "re_eval":
                const quizId = task.quiz_id
                if (!quizId) break
                const id = task.type + "_" + quizId
                this.runTask(id, task, reEvaluate, [quizId])
                break
              case "destroy":
                console.log("destroying")
                await sleep_ms(3000)
                console.log("destroyed")
                break
            }
          } catch (error) {
            console.log(error)
          }

          /* FIX
          if (task.id) {
            await knex("background_task")
              .where("id", task.id)
              .del()
          }
          */
        }
        await sleep_ms(1000)
      }
    })()
  }
  runTask(id: string, task: any, action: any, params: any[]) {
    if (this.tasks[id]) {
      console.log("task already running")
      return
    }
    this.tasks[id] = { task: task }
    const add = (f: any) => {
      this.tasks[id] = { handle: f, ...this.tasks[id] }
    }
    return action(...params, this.progress, add)
  }
  stop() {
    this.running = false
    console.log("event loop stopped")
  }
  add(task: any) {
    this.queue.push(task)
  }
  list() {
    console.log("in queue")
    this.queue.forEach(task => console.log(task))
    console.log("in progress")
    console.log(this.tasks)
  }
  cancel(id: string) {
    const cancel = this.tasks[id].handle
    cancel()
    delete this.tasks[id]
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
