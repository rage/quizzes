import nock from "nock"
import app from "../../app"
import knex from "../../database/knex"
import { UserInfo } from "../../src/types"
import { safeClean, safeSeed, configQuizAnswerSoftDelete } from "../util"
import request from "supertest"
import QuizAnswer from "../../src/models/quiz_answer"
import UserQuizState from "../../src/models/user_quiz_state"
import redis from "../../config/redis"

describe("Deleting multiple of users answers", () => {
  afterAll(async () => {
    await safeClean()
    await knex.destroy()
    await redis.client?.flushall()
    await redis.client?.quit()
  })
  describe("teacher deletes same users different answers to same quiz", () => {
    beforeAll(async () => {
      await safeSeed(configQuizAnswerSoftDelete)
    })

    afterAll(async () => {
      await safeClean()
    })
    beforeEach(() => userSetup())
    test("deleting first answer", async () => {
      const response = await request(app.callback())
        .delete(
          "/api/v2/dashboard/answers/16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
        )
        .set("Authorization", `bearer teacher_token`)
        .set("Accept", "application/json")

      expect(response.status).toEqual(200)

      const deletedQuizAnswer = await QuizAnswer.query().findById(
        "16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
      )

      const userQuizState = (
        await UserQuizState.query()
          .where("user_id", 12345)
          .andWhere("quiz_id", "f98cd4b0-41b1-4a15-89a2-4c991ec67264")
      )[0]

      expect(deletedQuizAnswer.deleted).toEqual(true)
      expect(userQuizState.pointsAwarded).toEqual(2.25)
      expect(userQuizState.status).toEqual("open")
      expect(userQuizState.tries).toEqual(2)
      expect(userQuizState.spamFlags).toEqual(1)
    })

    test("deleting second answer", async () => {
      const response = await request(app.callback())
        .delete(
          "/api/v2/dashboard/answers/444bc441-3c97-45a0-be7a-db1516539871",
        )
        .set("Authorization", `bearer teacher_token`)
        .set("Accept", "application/json")

      expect(response.status).toEqual(200)

      const deletedQuizAnswer = await QuizAnswer.query().findById(
        "444bc441-3c97-45a0-be7a-db1516539871",
      )

      const userQuizState = (
        await UserQuizState.query()
          .where("user_id", 12345)
          .andWhere("quiz_id", "f98cd4b0-41b1-4a15-89a2-4c991ec67264")
      )[0]

      expect(deletedQuizAnswer.deleted).toEqual(true)
      expect(userQuizState.pointsAwarded).toEqual(1.5)
      expect(userQuizState.status).toEqual("open")
      expect(userQuizState.tries).toEqual(1)
      expect(userQuizState.spamFlags).toEqual(2)
    })

    test("deleting last answer", async () => {
      const response = await request(app.callback())
        .delete(
          "/api/v2/dashboard/answers/08e91588-e1df-4497-8ec3-368cebeb1f79",
        )
        .set("Authorization", `bearer teacher_token`)
        .set("Accept", "application/json")

      expect(response.status).toEqual(200)

      const deletedQuizAnswer = await QuizAnswer.query().findById(
        "08e91588-e1df-4497-8ec3-368cebeb1f79",
      )

      const userQuizState = (
        await UserQuizState.query()
          .where("user_id", 12345)
          .andWhere("quiz_id", "f98cd4b0-41b1-4a15-89a2-4c991ec67264")
      )[0]

      expect(deletedQuizAnswer.deleted).toEqual(true)
      expect(userQuizState.pointsAwarded).toEqual(0)
      expect(userQuizState.status).toEqual("open")
      expect(userQuizState.tries).toEqual(0)
      expect(userQuizState.spamFlags).toEqual(0)
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
      if (auth === "Bearer teacher_token") {
        return [
          200,
          {
            id: 23456,
            administrator: false,
          } as UserInfo,
        ]
      }
      if (auth === "Bearer assistant_token") {
        return [
          200,
          {
            id: 34567,
            administrator: false,
          } as UserInfo,
        ]
      }
      if (auth === "Bearer reviewer_token") {
        return [
          200,
          {
            id: 45678,
            administrator: false,
          } as UserInfo,
        ]
      }
    })
}
