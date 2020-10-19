import dotenv from "dotenv"
import redis from "redis"

import { promisify } from "util"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" })
}

export const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT as string, 10),
  password: process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD,
})

const get = promisify(client.get).bind(client)

const set = promisify(client.set).bind(client)

const setex = promisify(client.setex).bind(client)

export default {
  get,
  set,
  setex,
}
