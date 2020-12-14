import repl from "repl"
import * as models from "../src/models"
import * as services from "../src/services"
import lodash from "lodash"
import knex from "../database/knex"
import { Model, snakeCaseMappers } from "objection"
import * as pg from "pg"
import Manager from "./task_manager"

pg.types.setTypeParser(1700, function(val: any) {
  return parseFloat(val)
})

Model.knex(knex)
Model.columnNameMappers = snakeCaseMappers()

const environment = process.env.NODE_ENV || "development"

console.log(
  "Quizzes REPL. Models, services, knex and lodash should be available here.",
)
console.log(
  "Note that `_` is a special variable that refers to the result of the previous expression.",
)
console.log(
  "Type .help for help or refer to https://nodejs.org/api/repl.html for documentation.",
)
const replServer = repl.start(`Quizzes (${environment}) > `)

function addReplGlobal(globalName: string, value: any) {
  Object.defineProperty(replServer.context, globalName, {
    configurable: false,
    enumerable: true,
    value,
  })
}

Object.entries(models).forEach(([modelName, model]) => {
  addReplGlobal(modelName, model)
})

Object.entries(services).forEach(([modelName, model]) => {
  addReplGlobal(modelName, model)
})

addReplGlobal("lodash", lodash)
addReplGlobal("knex", knex)
addReplGlobal("tm", new Manager())
