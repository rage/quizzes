import Redis from "ioredis"

let client
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  client = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD,
  })
  if (client) {
    console.log(
      `Redis client initialized and running on ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    )
  }
} else {
  console.log("Redis uninitialized. Configuration missing.")
}

export default { client }
