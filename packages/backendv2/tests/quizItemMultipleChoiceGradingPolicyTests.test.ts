import nock from "nock"
import { Model, snakeCaseMappers } from "objection"
import request from "supertest"
import app from "../app"
import redis from "../config/redis"
import knex from "../database/knex"
import { UserInfo } from "../src/types"
import { safeClean, safeSeed } from "./util"

const allWrongQuizItem1 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "40f7a704-fbbe-4411-8176-31449a5968fe",
      optionAnswers: [
        {
          quizOptionId: "6b906647-7956-44b5-ac0f-77157c6c8a74",
        },
        {
          quizOptionId: "12a56d49-1f21-46ba-bcf7-5e90da61ecd1",
        },
      ],
    },
  ],
}

const someCorrectQuizItem1 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "40f7a704-fbbe-4411-8176-31449a5968fe",
      optionAnswers: [
        {
          quizOptionId: "6b906647-7956-44b5-ac0f-77157c6c8a74",
        },
        {
          quizOptionId: "08e648dd-176c-4ba9-a1e8-44231aef221f",
        },
      ],
    },
  ],
}

const allCorrectQuizItem1 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "40f7a704-fbbe-4411-8176-31449a5968fe",
      optionAnswers: [
        {
          quizOptionId: "08e648dd-176c-4ba9-a1e8-44231aef221f",
        },
        {
          quizOptionId: "53c77121-daf7-485e-805d-78550b6e435d",
        },
      ],
    },
  ],
}

const allWrongQuizItem2 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      optionAnswers: [
        {
          quizOptionId: "0862ddd4-e9d2-485b-b605-03cdfc94bcc4",
        },
        {
          quizOptionId: "853e536a-a374-4e80-ba81-23c75f475529",
        },
      ],
    },
  ],
}

const someCorrectQuizItem2 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      optionAnswers: [
        {
          quizOptionId: "853e536a-a374-4e80-ba81-23c75f475529",
        },
        {
          quizOptionId: "43142a08-2fd6-4356-b5cc-1a4b2d9ea085",
        },
      ],
    },
  ],
}

const allCorrectQuizItem2 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      optionAnswers: [
        {
          quizOptionId: "43142a08-2fd6-4356-b5cc-1a4b2d9ea085",
        },
        {
          quizOptionId: "2f5ad9fd-59c2-4909-bf85-42931149e47c",
        },
      ],
    },
  ],
}

const tooManySelectedQuizItem2 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      optionAnswers: [
        {
          quizOptionId: "43142a08-2fd6-4356-b5cc-1a4b2d9ea085",
        },
        {
          quizOptionId: "2f5ad9fd-59c2-4909-bf85-42931149e47c",
        },
        {
          quizOptionId: "853e536a-a374-4e80-ba81-23c75f475529",
        },
      ],
    },
  ],
}

const tooFewSelectedQuizItem2 = {
  userId: 1357,
  quizId: "d7389c86-7a3a-4593-b810-b2be35319520",
  itemAnswers: [
    {
      quizItemId: "ae7cd864-236d-4294-a6d8-57cf8ab71383",
      optionAnswers: [
        {
          quizOptionId: "43142a08-2fd6-4356-b5cc-1a4b2d9ea085",
        },
      ],
    },
  ],
}

describe("multiple-choice grading tests", () => {
  beforeAll(() => {
    Model.knex(knex)
    Model.columnNameMappers = snakeCaseMappers()
  })

  afterAll(async () => {
    await safeClean()
    await knex.destroy()
    await redis.client?.quit()
  })

  describe("NeedToSelectAllCorrectOptions correct grading", () => {
    beforeEach(async () => {
      await safeSeed({
        directory: "./database/seeds",
        specific: "multipleChoiceGradingPolicy.ts",
      })
    })

    afterEach(async () => {
      await safeClean()
    })

    beforeEach(() => {
      nock("https://tmc.mooc.fi")
        .get("/api/v8/users/current?show_user_fields=true")
        .reply(function() {
          const auth = this.req.headers.authorization
          if (auth === "Bearer PLEB_TOKEN") {
            return [
              200,
              {
                id: 1234,
                administrator: false,
              } as UserInfo,
            ]
          }
          if (auth === "Bearer ADMIN_TOKEN") {
            return [
              200,
              {
                administrator: true,
              } as UserInfo,
            ]
          }
        })
    })

    it("grades correctly when all wrong", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(allWrongQuizItem1)

      expect(res.status).toEqual(200)
      expect(res.body.quizAnswer.itemAnswers[0].correct).toEqual(false)
    })

    it("grades correctly when some correct", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(someCorrectQuizItem1)

      expect(res.status).toEqual(200)
      expect(res.body.quizAnswer.itemAnswers[0].correct).toEqual(false)
    })

    it("grades correctly when all correct", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(allCorrectQuizItem1)

      expect(res.status).toEqual(200)
      expect(res.body.quizAnswer.itemAnswers[0].correct).toEqual(true)
    })
  })

  describe("NeedToSelectNCorrectOptions correct grading", () => {
    beforeEach(async () => {
      await safeSeed({
        directory: "./database/seeds",
        specific: "multipleChoiceGradingPolicy.ts",
      })
    })

    afterEach(async () => {
      await safeClean()
    })

    beforeEach(() => {
      nock("https://tmc.mooc.fi")
        .get("/api/v8/users/current?show_user_fields=true")
        .reply(function() {
          const auth = this.req.headers.authorization
          if (auth === "Bearer PLEB_TOKEN") {
            return [
              200,
              {
                id: 1234,
                administrator: false,
              } as UserInfo,
            ]
          }
          if (auth === "Bearer ADMIN_TOKEN") {
            return [
              200,
              {
                administrator: true,
              } as UserInfo,
            ]
          }
        })
    })

    it("grades correctly when all wrong", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(allWrongQuizItem2)

      expect(res.status).toBe(200)
      expect(res.body.quizAnswer.itemAnswers[0].correct).toEqual(false)
    })

    it("grades correctly when some correct", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(someCorrectQuizItem2)

      expect(res.status).toBe(200)
      expect(res.body.quizAnswer.itemAnswers[0].correct).toEqual(false)
    })

    it("grades correctly when all correct", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(allCorrectQuizItem2)

      expect(res.status).toBe(200)
      expect(res.body.quizAnswer.itemAnswers[0].correct).toEqual(true)
    })

    it("grades correctly when too many options selected", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(tooManySelectedQuizItem2)

      expect(500)
    })

    it("grades correctly when too few options selected", async () => {
      const res = await request(app.callback())
        .post("/api/v2/widget/answer")
        .set("Authorization", "bearer PLEB_TOKEN")
        .set("Accept", "application/json")
        .send(tooFewSelectedQuizItem2)

      expect(500)
    })
  })
})
