export interface EditableQuiz {
  id: string
  grantPointsPolicy: string
  courseId: string
  part: number
  section: number
  points: number
  tries: number
  triesLimited: boolean
  deadline: null
  open: null
  autoConfirm: boolean
  excludedFromScore: boolean
  awardPointsEvenIfWrong: boolean
  createdAt: Date
  updatedAt: Date
  texts: QuizText[]
  items: Item[]
  peerReviewCollections: any[]
}

export interface Item {
  id: string
  quizId: string
  type: string
  order: number
  minWords: null
  maxWords: null
  minValue: number | null
  maxValue: number | null
  formatRegex: null
  multi: boolean
  usesSharedOptionFeedbackMessage: boolean
  createdAt: Date
  updatedAt: Date
  texts: ItemText[]
  options: any[]
}

export interface ItemText {
  quizItemId: string
  languageId: string
  title: string
  body: null
  minLabel: null
  maxLabel: null
  sharedOptionFeedbackMessage: null
  createdAt: Date
  updatedAt: Date
}

export interface QuizText {
  quizId: string
  languageId: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}
