import nock from "nock"

import { GlobalLogger } from "../src/middleware/logger"
import { relayNewAnswer } from "../src/services/plagiarism"

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret"
})

afterEach(() => {
  nock.cleanAll()
  jest.restoreAllMocks()
})

describe("plagiarism relay", () => {
  test("logs a failure without the request's credentials", async () => {
    nock("http://localhost:5150").post("/new").reply(500)
    const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {})
    const loggerError = jest
      .spyOn(GlobalLogger, "error")
      .mockImplementation(() => GlobalLogger)

    await relayNewAnswer({ data: "essay text" })

    expect(consoleLog).not.toHaveBeenCalled()
    expect(loggerError).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ status: 500 }),
    )
    const logged = JSON.stringify(loggerError.mock.calls)
    expect(logged).not.toMatch(/authorization|essay text/i)
  })
})
