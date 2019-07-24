export type MiscEvent = React.FormEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>

export type QuizItemType =
  | "essay"
  | "multiple-choice"
  | "scale"
  | "checkbox"
  | "open"
  | "research-agreement"
  | "feedback"
  | "custom-frontend-accept-data"

export interface IQuizText {
  quizId: string
  languageId: string
  title: string
  body: string
}

export interface IQuiz {
  id: string
  courseId: string
  part: number
  section: number
  points: number
  tries: number
  triesLimited: boolean
  deadline: Date
  open: Date
  autoConfirm: boolean
  excludedFromScore: boolean
  texts: IQuizText[]
  course: ICourse
  items: IQuizItem[]
}

export interface IQuizItemOptionText {
  quizOptionId: string
  languageId: string
  title: string
  body: string
  successMessage: string
  failureMessage: string
}

export interface IQuizItemOption {
  id: string
  quizItemId: string
  order: number
  correct: boolean
  texts: IQuizItemOptionText[]
}

export interface IQuizItemText {
  quizItemId: string
  languageId: string
  title: string
  body: string
  successMessage: string
  failureMessage: string
  minLabel: string
  maxLabel: string
}

export interface IQuizItem {
  id: string
  quizId: string
  type: QuizItemType
  order: number
  minWords: number
  maxWords: number
  minValue: number
  maxValue: number
  validityRegex: string
  formatRegex: string
  multi: boolean
  texts: IQuizItemText[]
  options: IQuizItemOption[]
}

export interface ICourseText {
  courseId: string
  languageId: string
  abbreviation: string
  title: string
  body: string
}

export interface ICourse {
  id: string
  minScoreToPass: number
  minProgressToPass: number
  minPeerReviewsReceived: number
  minPeerReviewsGiven: number
  minReviewAverage: number
  maxSpamFlags: number
  languages: ILanguage[]
  texts: ICourseText[]
  organization: any
}

export interface IPeerReviewCollection {
  a: any
}

export interface ILanguage {
  id: string
  country: string
  name: string
}
