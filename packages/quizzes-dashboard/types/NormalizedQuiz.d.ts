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

export interface Item {
  id: string
  quizId: string
  type: string
  order: number
  validityRegex: string | null
  formatRegex: string | null
  multi: boolean
  createdAt: Date
  updatedAt: Date
  minWords: string | null
  maxWords: string | null
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

export interface Option {
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

export interface Course {
  id: string
  minScoreToPass: number | null
  minProgressToPass: number | null
  minPeerReviewsReceived: number | null
  minPeerReviewsGiven: number | null
  minReviewAverage: number | null
  maxSpamFlags: number | null
  createdAt: Date
  updatedAt: Date
  organizationId: null
  moocfiId: string
  maxReviewSpamFlags: number
  texts: string[]
}
