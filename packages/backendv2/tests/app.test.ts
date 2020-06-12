import request from "supertest"
import app from "../"

test("kissa", async () => {
  const response = await request(app.callback()).get(
    "/api/v2/widget/4bf4cf2f-3058-4311-8d16-26d781261af7/preview",
  )
  console.log(response)
})
