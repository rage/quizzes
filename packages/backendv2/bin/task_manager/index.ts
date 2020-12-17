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
  running = false
  availableSlots = ["re-evaluate", "recalculate", "broadcast"]

  constructor() {
    this.start()
  }

  async start() {
    if (this.running) {
      return
    }
    this.running = true
    while (this.running) {
      if (this.queue.length > 0) {
        const task = this.queue.shift()
        if (task) {
          console.log("running a task from queue")
          this.run(task)
        }
        continue
      }
      for (const allocatable of this.availableSlots) {
        let task = await BackgroundTask.getByType(allocatable)
        if (!task) {
          continue
        }
        let { dependsOn } = task
        if (this.tasks[dependsOn]) {
          continue
        }
        while (dependsOn) {
          const dependency = await BackgroundTask.getById(dependsOn)
          if (!dependency) {
            break
          }
          task = dependency
          dependsOn = task.dependsOn
        }
        if (this.availableSlots.includes(task?.type)) {
          console.log("allocating: " + task.type)
          this.queue.push(task)
          this.availableSlots = this.availableSlots.filter(
            slot => slot !== task.type,
          )
          console.log("task added to queue")
        }
      }
      await sleep_ms(100)
    }
  }

  async run(task: BackgroundTask) {
    const { id } = task
    this.tasks[id] = { task }
    await task.run()
    await BackgroundTask.delete(task.id)
    delete this.tasks[id]
    this.release(task.type)
  }

  async run2(task: BackgroundTask) {
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
  private release(slot: string) {
    let slotsAvailable: string[] | Set<string> = new Set(this.availableSlots)
    slotsAvailable.add(slot)
    slotsAvailable = Array.from(slotsAvailable).sort()
    this.availableSlots = [...slotsAvailable]
    console.log("released: " + slot)
  }
}

new Manager()
