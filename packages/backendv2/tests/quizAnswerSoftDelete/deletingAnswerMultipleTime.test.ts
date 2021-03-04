import nock from "nock"
import knex from "../../database/knex"
import { UserInfo } from "../../src/types"
import { configQuizAnswerSoftDelete, safeClean, safeSeed } from "../util"
import request from "supertest"
import app from "../../app"
import { QuizAnswer, UserQuizState } from "../../src/models"
import redis from "../../config/redis"

describe("test", () => {
  afterAll(async () => {
    await safeClean()
    await knex.destroy()
    await redis.client?.flushall()
    await redis.client?.quit()
  })

  describe("deleting already deleted answer", () => {
    beforeAll(async () => {
      await safeSeed(configQuizAnswerSoftDelete)
    })

    afterAll(async () => {
      await safeClean()
    })

    beforeEach(() => userSetup())

    test("deleting already deleted answer does nothing", async () => {
      const response = await request(app.callback())
        .delete(
          "/api/v2/dashboard/answers/38140980-0bcb-4fec-b5a0-43c46312817b",
        )
        .set("Authorization", `bearer admin_token`)
        .set("Accept", "application/json")

      expect(response.status).toEqual(200)

      const deletedQuizAnswer = await QuizAnswer.query().findById(
        "38140980-0bcb-4fec-b5a0-43c46312817b",
      )

      const userQuizState = (
        await UserQuizState.query()
          .where("user_id", 12345)
          .andWhere("quiz_id", "f98cd4b0-41b1-4a15-89a2-4c991ec67264")
      )[0]

      expect(deletedQuizAnswer.deleted).toEqual(true)
      expect(userQuizState.pointsAwarded).toEqual(3)
      expect(userQuizState.status).toEqual("locked")
      expect(userQuizState.tries).toEqual(3)
    })
  })
})

const userSetup = () => {
  nock("https://tmc.mooc.fi")
    .get("/api/v8/users/current?show_user_fields=true")
    .reply(function() {
      const auth = this.req.headers.authorization
      if (auth === "Bearer admin_token") {
        return [
          200,
          {
            administrator: true,
          } as UserInfo,
        ]
      }
    })
}
