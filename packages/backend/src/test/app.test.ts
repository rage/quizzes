import request from "supertest"
import app from "../app"

describe("GET /random-url", () => {
  it("should return 404", done => {
    request(app)
      .get("/reset")
      .expect(404, done)
  })
})
