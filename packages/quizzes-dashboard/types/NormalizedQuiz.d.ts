import { PeerReviewQuestion, PeerReviewCollection, Question } from "./Quiz"

export interface action {
  type: string
  payload?: any
  meta?: any
}

export interface Entities {
  quizzes: { [quizId: string]: NormalizedQuiz }
  items: { [itemId: string]: NormalizedItem }
  options?: { [optionId: string]: NormalizedOption }
  result: string
  peerReviewCollections: {
    [peerReviewCollectionId: string]: NormalizedPeerReviewCollection
  }
  questions: { [questionId: string]: NormalizedQuestion }
}
export interface NormalizedQuiz {
  id: string
  courseId: string
  part: number
  section: number
  points: number
  deadline: string | null
  open: string | null
  excludedFromScore: boolean
  createdAt: string
  updatedAt: string
  autoConfirm: boolean
  tries: number
  triesLimited: boolean
  awardPointsEvenIfWrong: boolean
  grantPointsPolicy: string
  autoReject: boolean
  items: string[]
  peerReviews: any[]
  course: string
  title: string
  body: string
  submitMessage: string | null
}

export interface NormalizedItem {
  id: string
  quizId: string
  type: string
  order: number
  validityRegex: string | null
  formatRegex: string | null
  multi: boolean
  createdAt: string
  updatedAt: string
  minWords: number | null
  maxWords: number | null
  maxValue: number | null
  minValue: number | null
  usesSharedOptionFeedbackMessage: boolean
  options: string[]
  title: string
  body: string
  successMessage: string | null
  failureMessage: string | null
  sharedOptionFeedbackMessage: string | null
  allAnswersCorrect: boolean
}

export interface NormalizedOption {
  id: string
  quizItemId: string
  order: number
  correct: boolean
  createdAt: string
  updatedAt: string
  title: string
  body: string | null
  successMessage: null | string
  failureMessage: null | string
}

export interface NormalizedPeerReviewCollection {
  id: string
  quizId: string
  createdAt: string
  updatedAt: string
  questions: string[]
  title: string
  body: string
}

export interface NormalizedQuestion {
  id: string
  quizId: string
  peerReviewCollectionId: string
  default: boolean
  type: string
  answerRequired: boolean
  order: number
  createdAt: string
  updatedAt: string
  title: string
  body: string
}

export interface Course {
  id: string
  minScoreToPass: number | null
  minProgressToPass: number | null
  minPeerReviewsReceived: number | null
  minPeerReviewsGiven: number | null
  minReviewAverage: number | null
  maxSpamFlags: number | null
  createdAt: string
  updatedAt: string
  organizationId: null
  moocfiId: string
  maxReviewSpamFlags: number
  texts: string[]
}

export interface ItemVariables {
  scaleMin: number
  scaleMax: number
  validMin: boolean
  validMax: boolean
  array: number[]
  advancedEditing: boolean
  testingRegex: boolean
  regexTestAnswer: string
  regex: string
  validRegex: boolean
  newOptions: string[]
}

export interface OptionVariables {
  optionEditing: boolean
}

export interface QuizVariables {
  initialState: Quiz | NewQuiz
  addingNewItem: boolean
  newItemType: string
  newItems: string[]
  deadline: string
  validDeadline: boolean
  newQuiz: boolean
  newPeerReviews: string[]
}

export interface peerReviewVariables {
  newQuestions: string[]
}

export interface NewQuiz {
  courseId: string
  part: number
  section: number
  points: number
  deadline: Date | null
  open: Date | null
  excludedFromScore: boolean
  createdAt: Date
  updatedAt: Date
  autoConfirm: boolean
  tries: number
  triesLimited: boolean
  awardPointsEvenIfWrong: boolean
  grantPointsPolicy: string
  autoReject: boolean
  items: Item[]
  peerReviews: PeerReviewCollection[]
  title: string
  body: string
  submitMessage: string | null
}

export interface NewItem {
  quizId: string
  type: string
  order: number
  validityRegex: string | null
  formatRegex: string | null
  multi: boolean
  createdAt: string
  updatedAt: string
  minWords: number | null
  maxWords: number | null
  maxValue: number | null
  minValue: number | null
  usesSharedOptionFeedbackMessage: boolean
  options: string[]
  title: string
  body: string
  successMessage: string | null
  failureMessage: string | null
  sharedOptionFeedbackMessage: string | null
}

export interface NewOption {
  quizItemId: string
  order: number
  correct: boolean
  createdAt: string
  updatedAt: string
  title: string
  body: string | null
  successMessage: null | string
  failureMessage: null | string
}
