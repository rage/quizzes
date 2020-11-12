import dotenv from "dotenv"
import redis from "redis"

import { promisify } from "util"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" })
}

let client = null

/* Create client if variables available */
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT as string, 10),
    password: process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD,
  })
  client.on("error", err => {
    console.log(err)
  })

  client.on("connect", () => {
    console.log(
      `Connected to Redis running on - HOST: ${process.env.REDIS_HOST} PORT: ${process.env.REDIS_PORT} `,
    )
  })
}

let get = client ? promisify(client.get).bind(client) : null
let set = client ? promisify(client.get).bind(client) : null
let setex = client ? promisify(client.setex).bind(client) : null

export default {
  client,
  get,
  set,
  setex,
}