export interface EditableQuiz {
  id: string
  grantPointsPolicy: string
  courseId: string
  part: number
  section: number
  points: number
  tries: number
  triesLimited: boolean
  deadline: string | null
  open: string | null
  autoConfirm: boolean
  excludedFromScore: boolean
  awardPointsEvenIfWrong: boolean
  createdAt: string
  updatedAt: string
  texts: QuizText[]
  items: Item[]
  peerReviews: any[]
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
  validityRegex: string | null
  formatRegex: null
  multi: boolean
  usesSharedOptionFeedbackMessage: boolean
  createdAt: string
  updatedAt: string
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
  successMessage: string | null
  failureMessage: string | null
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
  successMessage: string | null
  failureMessage: string | null
  createdAt: Date
  updatedAt: Date
}

export enum LanguageID {
  FiFI = "fi_FI",
}
