import Redis from "ioredis"
import env from "../src/util/environment"
import { GlobalLogger } from "../src/middleware/logger"

function parseSentinels(csv: string | undefined) {
  if (!csv) return []
  return csv
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(entry => {
      // supports "host:port" or just "host"
      const [host, portStr] = entry.replace(/^\[|\]$/g, "").split(":") // IPv6 [] safe-ish
      const port = portStr ? Number(portStr) : 26379
      return { host, port }
    })
}

let client

// Check if we're using Sentinel mode
if (env.REDIS_SENTINELS) {
  const sentinels = parseSentinels(env.REDIS_SENTINELS)

  client = new Redis({
    sentinels,
    name: env.REDIS_MASTER_NAME || "mymaster",
    password: env.REDIS_PASSWORD,
    sentinelPassword: env.REDIS_SENTINEL_PASSWORD || undefined,
    db: env.REDIS_DB ? Number(env.REDIS_DB) : 3,
    enableReadyCheck: true,
    sentinelRetryStrategy: (times: number) => Math.min(times * 1000, 10000),
  })

  GlobalLogger.info(
    `Redis (Sentinel) client initialized. Sentinels: ${sentinels
      .map(s => `${s.host}:${s.port}`)
      .join(", ")}`,
  )
} else if (env.REDIS_HOST && env.REDIS_PORT) {
  // Fallback to direct connection mode
  client = new Redis({
    port: Number(env.REDIS_PORT),
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD && env.REDIS_PASSWORD,
    db: env.REDIS_DB ? Number(env.REDIS_DB) : 3,
  })

  GlobalLogger.info(
    `Redis client initialized and running on ${env.REDIS_HOST}:${env.REDIS_PORT}`,
  )
} else {
  GlobalLogger.warn("Redis uninitialized. Configuration missing.")
}

export default { client }
