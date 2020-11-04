const knexCleaner = require("knex-cleaner")
import knex from "../database/knex"
import { Quiz } from "../src/models"

export const safeClean = () => {
  if (process.env.NODE_ENV === "test") {
    return knexCleaner.clean(knex)
  }
}

export const safeSeed = (config?: any) => {
  if (process.env.NODE_ENV === "test") {
    return knex.seed.run(config)
  }
}

export const expectQuizToEqual = (received: Quiz, expected: any) => {
  const receivedItems = received.items
  const expectedItems = expected.items
  expect(receivedItems).toHaveLength(expectedItems.length)
  for (const expectedItem of expectedItems) {
    expect(receivedItems).toContainEqual(expectedItem)
  }
  const receivedOptions = receivedItems.map(item => item.options).flat()
  const expectedOptions = expectedItems.map((item: any) => item.options).flat()
  expect(receivedOptions).toHaveLength(expectedOptions.length)
  for (const expectedOption of expectedOptions) {
    expect(receivedOptions).toContainEqual(expectedOption)
  }
  const receivedPeerReviews = received.peerReviews
  const expectedPeerReviews = expected.peerReviews
  expect(receivedPeerReviews).toHaveLength(expectedPeerReviews.length)
  for (const expectedPeerReview of expectedPeerReviews) {
    expect(receivedPeerReviews).toContainEqual(expectedPeerReview)
  }
  const receivedPeerReviewQuestions = receivedPeerReviews
    .map(peerReview => peerReview.questions)
    .flat()
  const expectedPeerReviewQuestions = expectedPeerReviews
    .map((peerReview: any) => peerReview.questions)
    .flat()
  expect(receivedPeerReviewQuestions).toHaveLength(
    expectedPeerReviewQuestions.length,
  )
  for (const expectedPeerReviewQuestion of expectedPeerReviewQuestions) {
    expect(receivedPeerReviewQuestions).toContainEqual(
      expectedPeerReviewQuestion,
    )
  }
  const expectedClone = { ...expected }
  delete received.items
  delete expectedClone.items
  delete received.peerReviews
  delete expectedClone.peerReviews
  expect(received).toStrictEqual(expectedClone)
}
