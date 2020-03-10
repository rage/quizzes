import {
  Quiz,
  QuizItem,
  QuizOption,
  QuizTranslation,
  QuizItemTranslation,
  QuizOptionTranslation,
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
  PeerReviewCollection,
  PeerReviewCollectionTranslation,
  UserCourseRole,
} from "../models"
import { Permission } from "services/authorization.service"
import { RequiredAction } from "../services/kafka.service"

export class ITMCProfile {
  username: string
  accessToken: string
}

export interface ITMCProfileDetails {
  id: number
  username: string
  email: string
  administrator: boolean
  error?: string
  user_field?: {
    first_name: string
    last_name: string
    organizational_id: string
    course_announcements: boolean
  }
  extra_fields?: {
    language: string
    open_university: string
    helsinki_university: string
    research: string
    marketing: string
    deadline: string
  }
}

export interface ITMCLoginCredentials {
  username: string
  password: string
}

export interface IQuizQuery {
  id?: string
  courseId?: string
  courseAbbreviation?: string
  coursePart?: number
  course?: boolean
  language?: string
  items?: boolean
  options?: boolean
  peerreviews?: boolean
  stripped?: boolean
  exclude?: boolean
}

export interface IQuizAnswerQuery {
  id?: string
  quizId?: string
  userId?: number
  // should prob only use statuses
  status?: string
  statuses?: string[]
  firstAllowedTime?: Date
  lastAllowedTime?: Date
  languageIds?: string[]
  minPeerReviewsGiven?: number
  maxPeerReviewsGiven?: number
  minPeerReviewsReceived?: number
  maxPeerReviewsReceived?: number
  minSpamFlags?: number
  maxSpamFlags?: number
  minPeerReviewAverage?: number
  maxPeerReviewAverage?: number
  addPeerReviews?: boolean
  addSpamFlagNumber?: boolean
  quizRequiresPeerReviews?: boolean
  skip?: number
  limit?: number
  user?: ITMCProfileDetails
}

interface ICourseQuery {
  language?: string
  id?: string
  attentionAnswers?: boolean
  user?: ITMCProfileDetails
}

export interface INewQuizQuery {
  id?: string
  courseId?: string
  texts: INewQuizTranslation[]
  part?: number
  section?: number
  deadline?: Date
  open?: Date
  items: INewQuizItem[]
  PeerReviewCollections: INewPeerReviewCollection[]
  excludedFromScore?: boolean
}

export interface INewQuizTranslation {
  quiz?: Quiz
  quizId?: string
  languageId: string
  title: string
  body: string
  submitMessage?: string
}

export interface INewQuizItem {
  id?: string
  quiz?: Quiz | Promise<Quiz>
  quizId?: string
  type: string
  order: number
  texts: INewQuizItemTranslation[]
  options: INewQuizOption[]
  validityRegex?: string
  formatRegex?: string
}

export interface INewQuizItemTranslation {
  quizItem?: Promise<QuizItem> | QuizItem
  quizItemId?: string
  languageId: string
  title?: string
  body?: string
  successMessage?: string
  failureMessage?: string
}

export interface INewQuizOption {
  id?: string
  quizItem?: QuizItem
  quizItemId?: string
  order: number
  texts: INewQuizOptionTranslation[]
  correct: boolean
}

export interface INewQuizOptionTranslation {
  quizOption?: Promise<QuizOption> | QuizOption
  quizOptionId?: string
  languageId: string
  title: string
  body?: string
  successMessage?: string
  failureMessage?: string
}

export interface INewPeerReviewQuestion {
  quiz?: Quiz
  quizId?: string
  collectionId: string
  texts: INewPeerReviewQuestionTranslation[]
  default: boolean
  type: string
  answerRequired: boolean
  order: number
}

export interface INewPeerReviewQuestionTranslation {
  peerReviewQuestion?: PeerReviewQuestion
  peerReviewQuestionId?: string
  languageId: string
  title: string
  body: string
}

export interface INewPeerReviewCollection {
  quiz?: Quiz
  quizId?: string
  texts: INewPeerReviewCollectionTranslation[]
  questions: INewPeerReviewQuestion[]
}

export interface INewPeerReviewCollectionTranslation {
  PeerReviewCollection?: PeerReviewCollection
  PeerReviewCollectionId: string
  languageId: string
  title: string
  body: string
}

export type QuizAnswerStatus =
  | "draft"
  | "submitted"
  | "spam"
  | "confirmed"
  | "rejected"
  | "deprecated"

export interface ProgressMessage {
  timestamp: string
  user_id: number
  course_id: string
  service_id: string
  progress: PointsByGroup[]
  message_format_version: Number
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
  required_actions: RequiredAction[] | null
  message_format_version: number
}

export interface QuizMessage {
  timestamp: string
  course_id: string
  service_id: string
  data: ExerciseData[]
  message_format_version: number
}

export interface ExerciseData {
  name: string
  id: string
  part: number
  section: number
  max_points: number
  deleted: boolean
}

export interface IAuthorizationQuery {
  user: ITMCProfileDetails
  answerId?: string
  courseId?: string
  quizId?: string
  permission: Permission
}
export interface QuizValidation {
  badWordLimit: boolean
  maxPointsAltered: boolean
  coursePartAltered: boolean
}

export interface AnsweredQuiz {
  quiz_id: string
  answered: boolean
  correct: boolean
}
