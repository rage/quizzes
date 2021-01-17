import Redis from "ioredis"

let client
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  client = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  })
}

export default { client }
