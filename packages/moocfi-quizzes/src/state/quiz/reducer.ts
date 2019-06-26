import { ActionType, getType } from "typesafe-actions"
import * as quiz from "./actions"

export type QuizText = {
  quizId: string
  languageId: string
  title: string
  body: string
}

export type CourseText = {
  courseId: string
  languageId: string
  abbreviation: string
  title: string
  body: string
}

export type CourseLanguage = {
  id: string
  country: string
  name: string
}

export type Course = {
  id: string
  minScoreToPass: number
  minProgressToPass: number
  minPeerReviewsReceived: number
  minPeerReviewsGiven: number
  minReviewAverage: number
  maxSpamFlags: number
  languages: CourseLanguage[]
  texts: CourseText[]
}

export type QuizItemOptionText = {
  quizOptionId: string
  languageId: string
  title: string
  body: string
  successMessage: string
  failureMessage: string
}

export type QuizItemOption = {
  id: string
  quizItemId: string
  order: number
  correct: boolean
  texts: QuizItemOptionText[]
}

export type QuizItemText = {
  quizItemId: string
  languageId: string
  title: string
  body: string
  successMessage: string
  failureMessage: string
}

export type QuizItem = {
  id: string
  quizId: string
  type:
    | "open"
    | "scale"
    | "essay"
    | "multiple-choice"
    | "checkbox"
    | "research-agreement"
    | "feedback"
    | "custom-frontend-accept-data"
  order: number
  minWords: number
  maxWords: number
  minValue: number
  maxValue: number
  formatRegex: string
  multi: boolean
  texts: QuizItemText[]
  options: QuizItemOption[]
}

export type PeerReviewQuestionText = {
  peerReviewQuestionId: string
  languageId: string
  title: string
  body: string
}

export type PeerReviewCollectionText = {
  peerReviewCollectionId: string
  languageId: string
  title: string
  body: string
}

export type PeerReviewQuestion = {
  id: string
  quizId: string
  peerReviewCollectionId: string
  default: boolean
  type: "grade" | "essay"
  answerRequired: boolean
  order: boolean
  texts: PeerReviewQuestionText[]
}

export type PeerReviewCollection = {
  id: string
  quizId: string
  questions: PeerReviewQuestion[]
  texts: PeerReviewCollectionText[]
}

export type Quiz = {
  id: string
  courseId: string
  part: number
  section: number
  points: number
  deadline: Date
  open: boolean
  autoConfirm: boolean
  excludedFromScore: boolean
  createdAt: Date
  updatedAt: Date
  texts: QuizText[]
  course: Course
  items: QuizItem[]
  peerReviewCollections: PeerReviewCollection[]
}

export type QuizState = Readonly<Quiz>

const initialValue = null

export const quizReducer = (
  state: QuizState = initialValue,
  action: ActionType<typeof quiz>,
): QuizState => {
  switch (action.type) {
    case getType(quiz.set):
      return action.payload
    case getType(quiz.clear):
      return initialValue
    default:
      return state
  }
}
