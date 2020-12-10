//const readline = require("readline")
import * as readline from "readline"
import knex from "../../database/knex"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let tasks: any[] = []

rl.on("line", (input: any) => {
  switch (input) {
    case "add":
      rl.question("give type: ", answer => {
        tasks.push({ type: answer })
      })
      break
  }
})

const sleep_ms = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const run = async () => {
  while (true) {
    ;(await knex("background_task").select()).forEach(task => tasks.push(task))
    while (tasks.length > 0) {
      const task = tasks.shift()
      switch (task.type) {
        case "create":
          console.log("creating")
          await sleep_ms(5000)
          console.log("created")
          break
        case "destroy":
          console.log("destroying")
          await sleep_ms(3000)
          console.log("destroyed")
          break
      }
      if (task.id) {
        await knex("background_task")
          .where("id", task.id)
          .del()
      }
    }
    await sleep_ms(1000)
  }
}

run()
