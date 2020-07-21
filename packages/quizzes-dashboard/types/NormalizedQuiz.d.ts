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
}
export interface NormalizedQuiz {
  id: string
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
  createdAt: Date
  updatedAt: Date
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

export interface NormalizedOption {
  id: string
  quizItemId: string
  order: number
  correct: boolean
  createdAt: Date
  updatedAt: Date
  title: string
  body: string | null
  successMessage: null | string
  failureMessage: null | string
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
  newQuiz: boolean
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
  peerReviews: PeerReview[]
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
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
  title: string
  body: string | null
  successMessage: null | string
  failureMessage: null | string
}
