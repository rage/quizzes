import { schema } from "normalizr"

export const options = new schema.Entity("options")

export const items = new schema.Entity("items", {
  options: [options],
})

export const question = new schema.Entity("question")

export const review = new schema.Entity("review", {
  questions: [question],
})

export const peerreviews = new schema.Entity("peerreviews", {
  reviews: [review],
})

export const normalizedQuiz = new schema.Entity("quiz", {
  items: [items],
  peerreviews: [peerreviews],
})
