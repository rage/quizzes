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

export enum QuizItemDirection {
  row = "row",
  column = "column",
}

export enum QuizItemFeedbackDisplayPolicy {
  onQuizItem = "DisplayFeedbackOnQuizItem",
  onAllOptions = "DisplayFeedbackOnAllOptions",
}

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
    | "enough-received-but-not-given"
    | "manual-review"
    | "given-more-than-enough"
    | "given-enough"
  itemAnswers: QuizItemAnswer[]
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
  maxReviewSpamFlags: number
  languages: CourseLanguage[]
  abbreviation: string
  title: string
  body: string
  languageId: string
}

export type QuizItemOption = {
  id: string
  quizItemId: string
  order: number
  correct: boolean
  title: string
  body: string
  successMessage: string
  failureMessage: string
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
  options: QuizItemOption[]
  title: string
  body: string
  successMessage: string
  failureMessage: string
  minLabel: string
  maxLabel: string
  sharedOptionFeedbackMessage?: string
  direction: QuizItemDirection
  feedbackDisplayPolicy: QuizItemFeedbackDisplayPolicy
}

export type PeerReviewQuestion = {
  id: string
  quizId: string
  peerReviewCollectionId: string
  default: boolean
  type: "grade" | "essay"
  answerRequired: boolean
  order: number
  title: string
  body: string
}

export type PeerReviewCollection = {
  id: string
  quizId: string
  questions: PeerReviewQuestion[]
  title: string
  body: string
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
  course: Course
  items: QuizItem[]
  peerReviewCollections: PeerReviewCollection[]
  tries: number
  triesLimited: boolean
  grantPointsPolicy: QuizPointsGrantingPolicy
  awardPointsEvenIfWrong: boolean
  title: string
  body: string
  submitMessage: string
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
  userId?: number
  rejectedQuizAnswerIds: string[]
  answers: PeerReviewQuestionAnswer[]
}

export interface IReceivedPeerReview {
  id: string
  peerReviewCollectionId?: string
  answers: PeerReviewQuestionAnswer[]
  createdAt: Date
}

export interface QuizAnswerStatePayload {
  quiz: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState | null
}

export interface PointsByGroup {
  group: string
  max_points: number
  n_points: number
  progress: number
}

export interface QuizAnswerMessage {
  timestamp: string
  exercise_id: string
  n_points: number
  completed: boolean
  user_id: number
  course_id: string
  service_id: string
  required_actions: string[] | null
  message_format_version: number
}
