import ValidationService from "../src/services/validation.service"
import { data } from "./data"
import { Quiz, QuizAnswer, UserQuizState } from "../src/models"

const validationService = new ValidationService()

let quiz: Quiz
let quizAnswer: QuizAnswer
let userQuizState: UserQuizState

describe("autoreject off 1", () => {
  beforeAll(() => {
    ;(quiz = { ...data.quiz } as Quiz),
      (quizAnswer = { ...data.quizAnswer } as QuizAnswer),
      (userQuizState = { ...data.userQuizState } as UserQuizState)
  })
  test("fresh answer", () => {
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("submitted")
  })
  test("given 1", () => {
    userQuizState.peerReviewsGiven = 1
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("submitted")
  })
  test("given 2", () => {
    userQuizState.peerReviewsGiven = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("submitted")
  })
  test("given 3", () => {
    userQuizState.peerReviewsGiven = 3
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("given-enough")
  })
  test("given 4", () => {
    userQuizState.peerReviewsGiven = 4
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("given-more-than-enough")
  })
  test("given 4, received 1", () => {
    userQuizState.peerReviewsReceived = 1
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("given-more-than-enough")
  })
  test("given 4, received 2", () => {
    userQuizState.peerReviewsReceived = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      data.passingPeerReviews,
    )
    expect(status).toBe("confirmed")
  })
  test("given 4, received 2, fail", () => {
    userQuizState.peerReviewsReceived = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      data.failingPeerReviews,
    )
    expect(status).toBe("manual-review")
  })
})

describe("autoreject off 2", () => {
  beforeAll(() => {
    ;(quiz = { ...data.quiz } as Quiz),
      (quizAnswer = { ...data.quizAnswer } as QuizAnswer),
      (userQuizState = { ...data.userQuizState } as UserQuizState)
  })
  test("spam 1", () => {
    userQuizState.spamFlags = 1
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review-once-given-and-received-enough")
  })
  test("spam 2", () => {
    userQuizState.spamFlags = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review-once-given-and-received-enough")
  })
  test("spam 3", () => {
    userQuizState.spamFlags = 3
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review-once-given-enough")
  })
  test("spam 3, given 3", () => {
    userQuizState.peerReviewsGiven = 3
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review")
  })
})

describe("autoreject off 3", () => {
  beforeAll(() => {
    ;(quiz = { ...data.quiz } as Quiz),
      (quizAnswer = { ...data.quizAnswer } as QuizAnswer),
      (userQuizState = { ...data.userQuizState } as UserQuizState)
  })
  test("spam 1", () => {
    userQuizState.spamFlags = 1
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review-once-given-and-received-enough")
  })
  test("spam 1, given 3", () => {
    userQuizState.peerReviewsGiven = 3
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review-once-received-enough")
  })
  test("spam 1, given 4", () => {
    userQuizState.peerReviewsGiven = 4
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe(
      "manual-review-once-received-enough-given-more-than-enough",
    )
  })
  test("spam 1, given 3, received 2", () => {
    userQuizState.peerReviewsReceived = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      [],
    )
    expect(status).toBe("manual-review")
  })
})

describe("autoreject on 1", () => {
  beforeAll(() => {
    ;(quiz = { ...data.quiz } as Quiz),
      (quizAnswer = { ...data.quizAnswer } as QuizAnswer),
      (userQuizState = { ...data.userQuizState } as UserQuizState)
  })
  test("given 3, received 2", () => {
    quiz.autoReject = true
    userQuizState.peerReviewsGiven = 3
    userQuizState.peerReviewsReceived = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      data.failingPeerReviews,
    )
    expect(status).toBe("rejected")
  })
})

describe("autoreject on 2", () => {
  beforeAll(() => {
    ;(quiz = { ...data.quiz } as Quiz),
      (quizAnswer = { ...data.quizAnswer } as QuizAnswer),
      (userQuizState = { ...data.userQuizState } as UserQuizState)
  })
  test("spam 1", () => {
    quiz.autoReject = true
    userQuizState.spamFlags = 1
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      data.failingPeerReviews,
    )
    expect(status).toBe("submitted")
  })
  test("spam 2", () => {
    userQuizState.spamFlags = 2
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      data.failingPeerReviews,
    )
    expect(status).toBe("submitted")
  })
  test("spam 3", () => {
    userQuizState.spamFlags = 3
    const status = validationService.assessAnswerStatus(
      quiz,
      quizAnswer,
      userQuizState,
      data.failingPeerReviews,
    )
    expect(status).toBe("spam")
  })
})
