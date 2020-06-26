export interface Quizv2 {
  id: string
  courseId: string
  part: number
  section: number
  points: number
  deadline: null
  open: null
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
  submitMessage: null
}

export interface Item {
  id: string
  quizId: string
  type: string
  order: number
  validityRegex: null
  formatRegex: null
  multi: boolean
  createdAt: Date
  updatedAt: Date
  minWords: null
  maxWords: null
  maxValue: null
  minValue: null
  usesSharedOptionFeedbackMessage: boolean
  options: any[]
  title: null
  body: null
  successMessage: null
  failureMessage: null
  sharedOptionFeedbackMessage: null
}

export interface PeerReview {
  id: string
  quizId: string
  createdAt: Date
  updatedAt: Date
  questions: Question[]
  title: string
  body: string
}

export interface Question {
  id: string
  quizId: string
  peerReviewCollectionId: string
  default: boolean
  type: string
  answerRequired: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  title: string
  body: string
}

export interface Course {
  id: string
  minScoreToPass: null
  minProgressToPass: null
  minPeerReviewsReceived: null
  minPeerReviewsGiven: null
  minReviewAverage: null
  maxSpamFlags: null
  createdAt: Date
  updatedAt: Date
  organizationId: null
  moocfiId: null
  maxReviewSpamFlags: number
  languageId: string
  title: string
  body: string
  abbreviation: string
}
