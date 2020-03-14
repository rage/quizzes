import { createContext } from "react"
import { PointsByGroup } from "../modelTypes"

export interface ProgressData {
  completed: boolean
  points_to_pass: number
  exercise_completions_to_pass: number
  n_points: number
  max_points: number
  exercise_completions: number
  total_exercises: number
  required_actions: RequiredAction[]
  progressByGroup: ProgressByGroup
  exercisesByPart: ExercisesByPart
  answersByPart: AnswersByPart
  // exercise_completions_by_section: any
}

export type ProgressByGroup = { [group: string]: PointsByGroup }

export type ExercisesByPart = { [part: number]: Exercise[] }

export type AnswersByPart = { [part: number]: ExerciseCompletion[] }

type Exercise = {
  id: string
  quizzes_id: string
  name: string
  part: number
  section: number
  max_points: number
}

type ExerciseCompletion = {
  exercise_id: string
  exercise_quizzes_id: string
  part: number
  section: number
  n_points: number
  completed: boolean
  required_actions: RequiredAction[]
}

export enum RequiredAction {
  REJECTED = "REJECTED",
  GIVE_PEER_REVIEW = "GIVE_PEER_REVIEW",
  PENDING_PEER_REVIEW = "PENDING_PEER_REVIEW",
}

interface ProviderBaseInterface {
  notifyError?: (message: string) => void
}

export interface CourseProgressProviderInterface extends ProviderBaseInterface {
  error?: boolean
  loading?: boolean
  courseProgressData?: ProgressData
}

export interface CourseStatusProviderInterface extends ProviderBaseInterface {
  updateQuiz?: { [id: string]: boolean }
  quizUpdated?: (id: string) => void
}

export const CourseStatusProviderContext = createContext<
  CourseStatusProviderInterface
>({})

export const CourseProgressProviderContext = createContext<
  CourseProgressProviderInterface
>({})
