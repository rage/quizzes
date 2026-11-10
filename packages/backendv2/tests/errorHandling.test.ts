import request from "supertest"
import type winston from "winston"

import * as Sentry from "@sentry/node"

import app from "../app"
import redis from "../config/redis"
import knex from "../database/knex"
import { GlobalLogger } from "../src/middleware/logger"
import { configA, safeClean, safeSeed } from "./util"

jest.mock("@sentry/node", () => ({
  ...jest.requireActual("@sentry/node"),
  captureException: jest.fn(),
}))

const loggedEntries: unknown[][] = []

beforeAll(async () => {
  await safeSeed(configA)
})

beforeEach(() => {
  loggedEntries.length = 0
  jest.mocked(Sentry.captureException).mockClear()
  const log = (...args: unknown[]) => {
    loggedEntries.push(args)
  }
  jest
    .spyOn(GlobalLogger, "child")
    .mockReturnValue({ info: log, warn: log, error: log } as winston.Logger)
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
  await redis.client?.quit()
})

describe("error responses", () => {
  test("malformed JSON is a 400 and not reported to Sentry", async () => {
    const response = await request(app.callback())
      .post("/api/v2/widget/answer")
      .set("Content-Type", "application/json")
      .send("{")
    expect(response.status).toBe(400)
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  test("an unknown quiz preview is a 404", async () => {
    const response = await request(app.callback()).get(
      "/api/v2/widget/quizzes/00000000-0000-0000-0000-000000000000/preview",
    )
    expect(response.status).toBe(404)
  })

  test("a malformed id is a 400 that hides the SQL", async () => {
    const response = await request(app.callback()).get(
      "/api/v2/widget/quizzes/not-a-uuid/preview",
    )
    expect(response.status).toBe(400)
    expect(response.body.message).not.toMatch(/select|not-a-uuid/i)
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })
})

describe("request logging", () => {
  test("leaves out the query string", async () => {
    await request(app.callback()).get(
      "/api/v2/widget/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/preview?downloadToken=secret-token",
    )
    expect(loggedEntries.length).toBeGreaterThan(0)
    expect(JSON.stringify(loggedEntries)).not.toContain("secret-token")
  })

  test("leaves out the SQL of a database error", async () => {
    await request(app.callback()).get(
      "/api/v2/widget/quizzes/not-a-uuid/preview",
    )
    const logged = JSON.stringify(loggedEntries)
    expect(logged).toContain("database error 22P02")
    expect(logged).not.toMatch(/select/i)
  })
})

describe("response headers", () => {
  test("forbid MIME sniffing", async () => {
    const response = await request(app.callback()).get(
      "/api/v2/widget/quizzes/4bf4cf2f-3058-4311-8d16-26d781261af7/preview",
    )
    expect(response.headers["x-content-type-options"]).toBe("nosniff")
    expect(response.headers["cache-control"]).toBeUndefined()
  })

  test("forbid caching dashboard responses", async () => {
    const response = await request(app.callback()).get(
      "/api/v2/dashboard/courses",
    )
    expect(response.headers["x-content-type-options"]).toBe("nosniff")
    expect(response.headers["cache-control"]).toBe("no-store")
  })
})
