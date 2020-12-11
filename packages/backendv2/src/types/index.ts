import winston from "winston"
import { ParameterizedContext } from "koa"

export interface CustomContext extends ParameterizedContext {
  log: winston.Logger
}

export interface CustomState {
  user: UserInfo
  start: number
}

export interface UserInfo {
  id: number
  username: string
  email: string
  user_field: UserField
  extra_fields: ExtraFields
  administrator: boolean
}

export interface ExtraFields {}

export interface UserField {
  first_name: string
  last_name: string
  html1: string
  organizational_id: string
  course_announcements: boolean
}

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
  attempted: boolean
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

export interface ExerciseData {
  name: string
  id: string
  part: number
  section: number
  max_points: number
  deleted: boolean
}

export enum RequiredAction {
  REJECTED = "REJECTED",
  GIVE_PEER_REVIEW = "GIVE_PEER_REVIEW",
  PENDING_PEER_REVIEW = "PENDING_PEER_REVIEW",
}

export interface EditCoursePayloadFields {
  courseId?: string
  moocfiId?: string
  title?: string
  abbreviation?: string
  languageId?: string
  createdAt?: string
  updatedAt?: string
}

export interface IPeerReview {
  id: string
  quizAnswerId: string
  userId: number
  peerReviewCollectionId: string
  rejectedQuizAnswerIds: string[]
  createdAt: Date
  updatedAt: Date
  answers: IPeerReviewAnswer[] | TReturnedPeerReviewAnswer[]
}
export interface IPeerReviewAnswer {
  peerReviewId: string
  peerReviewQuestionId: string
  value: number
  text: null
  createdAt: Date
  updatedAt: Date
}

export type TReturnedPeerReviewAnswer = Omit<
  IPeerReviewAnswer,
  "createdAt" | "updatedAt"
>

export type TPeerReviewGradeAnswer = {
  peerReviewQuestionId: string
  value: number | null
}

export type TPeerReviewEssayAnswer = {
  peerReviewQuestionId: string
  text: string
}

export type TPeerReviewQuestionAnswer =
  | TPeerReviewGradeAnswer
  | TPeerReviewEssayAnswer

export type TPeerReviewGiven = {
  quizAnswerId: string
  peerReviewCollectionId: string
  userId: number
  rejectedQuizAnswerIds: string[]
  answers: TPeerReviewQuestionAnswer[]
}
