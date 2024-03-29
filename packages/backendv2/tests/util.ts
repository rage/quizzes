const knexCleaner = require("knex-cleaner")
import knex from "../database/knex"
import { Quiz } from "../src/models"

export const uuid = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
export const dateTime = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/

export const safeClean = async () => {
  if (process.env.NODE_ENV === "test") {
    await knexCleaner.clean(knex)
  }
}

export const safeSeed = async (config?: any) => {
  if (process.env.NODE_ENV === "test") {
    await knex.seed.run(config)
  }
}

export const configA = { directory: "./database/seeds", specific: "a.ts" }

export const configQuizAnswerSoftDelete = {
  directory: "./database/seeds",
  specific: "quizAnswerSoftDelete.ts",
}

export const expectQuizToEqual = (received: Quiz, expected: any) => {
  delete received.createdAt
  delete received.updatedAt
  delete expected.createdAt
  delete expected.updatedAt
  const receivedItems = received.items.map(item => {
    delete item.createdAt
    delete item.updatedAt
    item.options.map(option => {
      delete option.createdAt
      delete option.updatedAt
      return option
    })
    return item
  })

  const expectedItems: any[] = expected.items.map((item: any) => {
    delete item.createdAt
    delete item.updatedAt
    item.options.map((option: any) => {
      delete option.createdAt
      delete option.updatedAt
      return option
    })
    return item
  })

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

  const receivedPeerReviews = received.peerReviewCollections.map(prc => {
    delete prc.createdAt
    delete prc.updatedAt
    prc.questions.map(prcq => {
      delete prcq.createdAt
      delete prcq.updatedAt
      return prcq
    })
    return prc
  })
  const expectedPeerReviews = expected.peerReviewCollections.map((prc: any) => {
    delete prc.createdAt
    delete prc.updatedAt
    prc.questions.map((prcq: any) => {
      delete prcq.createdAt
      delete prcq.updatedAt
      return prcq
    })
    return prc
  })

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
  delete received.peerReviewCollections
  delete expectedClone.peerReviewCollections
  expect(received).toStrictEqual(expectedClone)
}
