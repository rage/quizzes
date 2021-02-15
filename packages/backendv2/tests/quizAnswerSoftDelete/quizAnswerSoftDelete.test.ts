import nock from "nock"
import { Model, snakeCaseMappers } from "objection"
import request from "supertest"
import app from "../../app"
import knex from "../../database/knex"
import { QuizAnswer, UserQuizState } from "../../src/models"
import { UserInfo } from "../../src/types"
import { configQuizAnswerSoftDelete, safeClean, safeSeed } from "../util"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

describe("Soft delete quiz answer and update user quiz state", () => {
  describe("When users with different roles delete answers", () => {
    afterAll(async () => {
      await safeClean()
      await knex.destroy()
    })
    describe("When no-body or reviewer deletes answer", () => {
      beforeEach(() => userSetup())
      beforeAll(async () => {
        await safeSeed(configQuizAnswerSoftDelete)
      })

      afterAll(async () => {
        await safeClean()
      })

      it("responds with 401 with unauthorized token", async () => {
        const response = await request(app.callback())
          .delete(
            "/api/v2/dashboard/answers/16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
          )
          .set("Authorization", `bearer bad_token`)
          .set("Accept", "application/json")

        expect(response.status).toEqual(401)
      })

      it("responds with 403 with insufficient priviledges", async () => {
        const response = await request(app.callback())
          .delete(
            "/api/v2/dashboard/answers/16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
          )
          .set("Authorization", `bearer reviewer_token`)
          .set("Accept", "application/json")

        expect(response.status).toEqual(403)
      })
    })

    describe("When assistant deletes answer", () => {
      beforeEach(() => userSetup())
      beforeAll(async () => {
        await safeSeed(configQuizAnswerSoftDelete)
      })

      afterAll(async () => {
        await safeClean()
      })

      it("responds with 200", async () => {
        const response = await request(app.callback())
          .delete(
            "/api/v2/dashboard/answers/16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
          )
          .set("Authorization", `bearer assistant_token`)
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
      })
    })

    describe("When teacher deletes answer", () => {
      beforeEach(() => userSetup())
      beforeAll(async () => {
        await safeSeed(configQuizAnswerSoftDelete)
      })

      afterAll(async () => {
        await safeClean()
      })

      it("it responds with 200", async () => {
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
      })
    })

    describe("When admin deletes answer", () => {
      beforeEach(() => userSetup())
      beforeAll(async () => {
        await safeSeed(configQuizAnswerSoftDelete)
      })

      afterAll(async () => {
        await safeClean()
      })

      it("it responds with 200", async () => {
        const response = await request(app.callback())
          .delete(
            "/api/v2/dashboard/answers/16ffa5c3-6536-43f2-8254-499a7d4d8eb1",
          )
          .set("Authorization", `bearer admin_token`)
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
      })
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
