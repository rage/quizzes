export type QuizItemType =
  | "essay"
  | "multiple-choice"
  | "scale"
  | "checkbox"
  | "open"
  | "research-agreement"
  | "feedback"
  | "custom-frontend-accept-data"

export type QuizPointsGrantingPolicy =
  | "grant_whenever_possible"
  | "grant_only_when_answer_fully_correct"

export type MiscEvent = React.FormEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>

export type UserQuizState = {
  userId: number
  quizId: string
  peerReviewsGiven: number
  peerReviewsReceived: number
  pointsAwarded: number | null
  spamFlags: number
  tries: number
  status: "open" | "locked"
}

export type QuizOptionAnswer = {
  id?: string
  quizItemAnswerId?: string
  quizOptionId: string
}

export type QuizItemAnswer = {
  id?: string
  quizAnswerId?: string
  quizItemId: string
  textData: string | null
  intData: number | null
  correct?: boolean
  optionAnswers: QuizOptionAnswer[]
}

export type QuizAnswer = {
  id?: string
  quizId: string
  userId?: number
  languageId: string
  status?:
    | "draft"
    | "submitted"
    | "spam"
    | "confirmed"
    | "rejected"
    | "deprecated"
  itemAnswers: QuizItemAnswer[]
}

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
  minLabel: string
  maxLabel: string
  sharedOptionFeedbackMessage?: string
}

export type QuizItem = {
  id: string
  quizId: string
  type: QuizItemType
  order: number
  minWords: number
  maxWords: number
  minValue: number
  maxValue: number
  formatRegex: string
  usesSharedOptionFeedbackMessage: boolean
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
  order: number
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
  tries: number
  triesLimited: boolean
  grantPointsPolicy: QuizPointsGrantingPolicy
  awardPointsEvenIfWrong: boolean
}

export type PeerReviewGradeAnswer = {
  peerReviewQuestionId: string
  value: number | null
}

export type PeerReviewEssayAnswer = {
  peerReviewQuestionId: string
  text: string
}

export type PeerReviewQuestionAnswer =
  | PeerReviewGradeAnswer
  | PeerReviewEssayAnswer

export type PeerReviewAnswer = {
  quizAnswerId: string
  peerReviewCollectionId: string
  userId: number
  rejectedQuizAnswerIds: string[]
  answers: PeerReviewQuestionAnswer[]
}

export interface IReceivedPeerReview {
  id: string
  peerReviewCollectionId?: string
  answers: PeerReviewQuestionAnswer[]
  createdAt: Date
}
