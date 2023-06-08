import Redis from "ioredis"
import env from "../src/util/environment"

let client
if (env.REDIS_HOST && env.REDIS_PORT) {
  client = new Redis({
    port: Number(env.REDIS_PORT),
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD && env.REDIS_PASSWORD,
    db: env.REDIS_DB ? Number(env.REDIS_DB) : 3,
  })
  if (client) {
    console.log(
      `Redis client initialized and running on ${env.REDIS_HOST}:${env.REDIS_PORT}`,
    )
  }
} else {
  console.log("Redis uninitialized. Configuration missing.")
}

export default { client }
