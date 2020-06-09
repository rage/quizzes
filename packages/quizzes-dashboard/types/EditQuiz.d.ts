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
  options: Option[]
}

export interface ItemText {
  quizItemId: string
  languageId: string
  title: string
  body: string | null
  minLabel: string | null
  maxLabel: string | null
  sharedOptionFeedbackMessage: string | null
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

export interface Option {
  id: string
  quizItemId: string
  order: number
  correct: boolean
  createdAt: Date
  updatedAt: Date
  texts: OptionText[]
}

export interface OptionText {
  quizOptionId: string
  languageId: LanguageID
  title: string
  body: null
  successMessage: null | string
  failureMessage: null | string
  createdAt: Date
  updatedAt: Date
}

export enum LanguageID {
  FiFI = "fi_FI",
}
