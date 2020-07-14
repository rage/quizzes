import { EditableQuiz } from "./EditQuiz"

export interface action {
  type: string
  payload?: any
  meta?: any
}

export interface Entities {
  quizzes: { [quizId: string]: Quiz }
  items: { [itemId: string]: Item }
  options?: { [optionId: string]: Option }
  result: string
}
export interface Quiz {
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

export interface Item {
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
  // maxLabel: string | null
  // minLabel: string | null
  usesSharedOptionFeedbackMessage: boolean
  options: string[]
  title: string
  body: string
  successMessage: string | null
  failureMessage: string | null
  sharedOptionFeedbackMessage: string | null
}

export interface Option {
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
  initialState: EditableQuiz
  addingNewItem: boolean
  newItemType: string
  newItems: string[]
  deadlineTimeZone: string
}

export interface newItem {
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
  // maxLabel: string | null
  // minLabel: string | null
  usesSharedOptionFeedbackMessage: boolean
  options: string[]
  title: string
  body: string
  successMessage: string | null
  failureMessage: string | null
  sharedOptionFeedbackMessage: string | null
}

export interface newOption {
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
