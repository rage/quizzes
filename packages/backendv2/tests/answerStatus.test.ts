import knex from "../database/knex"
import { Model, snakeCaseMappers } from "objection"
import { Quiz, QuizAnswer, UserQuizState, Course } from "../src/models"
import { safeClean, safeSeed } from "./util"

beforeAll(() => {
  Model.knex(knex)
  Model.columnNameMappers = snakeCaseMappers()
})

afterAll(async () => {
  await safeClean()
  await knex.destroy()
})

let quiz: Quiz
let quizAnswer: QuizAnswer
let userQuizState: UserQuizState
let course: Course

describe("autoreject off 1", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "answerStatusDataPassing.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    quiz = await Quiz.getById("3c954097-268f-44bf-9d2e-1efaf9e8f122")
    quizAnswer = await QuizAnswer.getById(
      "baa83266-2194-43f4-be37-177c273c82b1",
    )
    userQuizState = await UserQuizState.getByUserAndQuiz(
      1234,
      "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    )
    course = await Course.getById(quiz.courseId)
  })

  test("fresh answer", async () => {
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("submitted")
  })

  test("given 2", async () => {
    userQuizState.peerReviewsGiven = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("submitted")
  })

  test("given 3", async () => {
    userQuizState.peerReviewsGiven = 3
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("given-enough")
  })

  test("given 4", async () => {
    userQuizState.peerReviewsGiven = 4
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("given-more-than-enough")
  })

  test("given 4, received 1", async () => {
    userQuizState.peerReviewsGiven = 4
    userQuizState.peerReviewsReceived = 1
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("given-more-than-enough")
  })

  test("given 4, received 2", async () => {
    userQuizState.peerReviewsGiven = 4
    userQuizState.peerReviewsReceived = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("confirmed")
  })
})

describe("autoreject off 1, failing", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "answerStatusDataFailing.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    quiz = await Quiz.getById("3c954097-268f-44bf-9d2e-1efaf9e8f122")
    quizAnswer = await QuizAnswer.getById(
      "baa83266-2194-43f4-be37-177c273c82b1",
    )
    userQuizState = await UserQuizState.getByUserAndQuiz(
      1234,
      "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    )
    course = await Course.getById(quiz.courseId)
  })
  test("given 4, received 2, fail", async () => {
    userQuizState.peerReviewsGiven = 4
    userQuizState.peerReviewsReceived = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review")
  })
})

describe("autoreject off 2", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "answerStatusDataPassing.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    quiz = await Quiz.getById("3c954097-268f-44bf-9d2e-1efaf9e8f122")
    quizAnswer = await QuizAnswer.getById(
      "baa83266-2194-43f4-be37-177c273c82b1",
    )
    userQuizState = await UserQuizState.getByUserAndQuiz(
      1234,
      "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    )
    course = await Course.getById(quiz.courseId)
  })

  test("spam 1", async () => {
    userQuizState.spamFlags = 1
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review-once-given-and-received-enough")
  })

  test("spam 2", async () => {
    userQuizState.spamFlags = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review-once-given-and-received-enough")
  })

  test("spam 3", async () => {
    userQuizState.spamFlags = 3
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review-once-given-enough")
  })

  test("spam 3, given 3", async () => {
    userQuizState.spamFlags = 3
    userQuizState.peerReviewsGiven = 3
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review")
  })
})

describe("autoreject of 3", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "answerStatusDataPassing.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    quiz = await Quiz.getById("3c954097-268f-44bf-9d2e-1efaf9e8f122")

    quizAnswer = await QuizAnswer.getById(
      "baa83266-2194-43f4-be37-177c273c82b1",
    )
    userQuizState = await UserQuizState.getByUserAndQuiz(
      1234,
      "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    )
    course = await Course.getById(quiz.courseId)
  })

  test("spam 1", async () => {
    userQuizState.spamFlags = 1
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review-once-given-and-received-enough")
  })

  test("spam 1, given 3", async () => {
    userQuizState.spamFlags = 1
    userQuizState.peerReviewsGiven = 3
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review-once-received-enough")
  })

  test("spam 1, given 4", async () => {
    userQuizState.spamFlags = 1
    userQuizState.peerReviewsGiven = 4
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe(
      "manual-review-once-received-enough-given-more-than-enough",
    )
  })

  test("spam 1, given 3, received 2", async () => {
    userQuizState.spamFlags = 1
    userQuizState.peerReviewsGiven = 3
    userQuizState.peerReviewsReceived = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("manual-review")
  })
})

describe("autoreject on 1", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "answerStatusDataFailing.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    quiz = await Quiz.getById("3c954097-268f-44bf-9d2e-1efaf9e8f122")
    quizAnswer = await QuizAnswer.getById(
      "baa83266-2194-43f4-be37-177c273c82b1",
    )
    userQuizState = await UserQuizState.getByUserAndQuiz(
      1234,
      "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    )
    course = await Course.getById(quiz.courseId)
  })

  test("given 3, received 2", async () => {
    quiz.autoReject = true
    userQuizState.peerReviewsGiven = 3
    userQuizState.peerReviewsReceived = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("rejected")
  })
})

describe("autoreject on 2", () => {
  beforeAll(async () => {
    await safeSeed({
      directory: "./database/seeds",
      specific: "answerStatusDataFailing.ts",
    })
  })

  afterAll(async () => {
    await safeClean()
  })

  beforeEach(async () => {
    quiz = await Quiz.getById("3c954097-268f-44bf-9d2e-1efaf9e8f122")
    quizAnswer = await QuizAnswer.getById(
      "baa83266-2194-43f4-be37-177c273c82b1",
    )
    userQuizState = await UserQuizState.getByUserAndQuiz(
      1234,
      "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    )
    course = await Course.getById(quiz.courseId)
  })

  test("spam 1", async () => {
    quiz.autoReject = true
    userQuizState.spamFlags = 1
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("submitted")
  })

  test("spam 2", async () => {
    quiz.autoReject = true
    userQuizState.spamFlags = 2
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("submitted")
  })

  test("spam 3", async () => {
    quiz.autoReject = true
    userQuizState.spamFlags = 3
    const status = await knex.transaction(async trx => {
      await QuizAnswer.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      return quizAnswer.status
    })
    expect(status).toBe("spam")
  })
})
