import dotenv from "dotenv"
import redis from "redis"
import { promisify } from "util"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" })
}

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
})

const publisher = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
})

const subscriber = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
})

const get = promisify(client.get).bind(client)

const set = promisify(client.set).bind(client)

export default {
  publisher,
  subscriber,
  get,
  set,
}
