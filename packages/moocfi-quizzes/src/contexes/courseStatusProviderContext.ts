import { createContext } from "react"
import { PointsByGroup } from "../modelTypes"

export interface ProgressResponse {
  user_course_progressess: UserCourseProgress
  completions: Completion[]
}

export interface ProgressData {
  completed: boolean
  points_to_pass: number
  n_points: number
  max_points: number
  exercise_completions: number
  total_exercises: number
  required_actions: RequiredAction[]
  progress: PointsByGroup[]
  exercises: Exercise[]
  answers: ExerciseCompletion[]
  exercise_completions_by_section: ExerciseCompletionsBySection[]
}

export interface UserCourseProgress {
  max_points: number
  n_points: number
  progress: PointsByGroup[]
  course: Course
}

export interface Completion {
  id: string
}

export interface Course {
  points_needed: number
  exercises: Exercise[]
}

export type Exercise = {
  id: string
  quizzes_id: string
  name: string
  part: number
  section: number
  max_points: number
  exercise_completions: ExerciseCompletion[]
}

export type ExerciseCompletion = {
  exercise_id: string
  exercise_quizzes_id: string
  part: number
  section: number
  n_points: number
  completed: boolean
  exercise_completion_required_actions: RequiredActionObject[]
}

export interface ExerciseCompletionsBySection {
  part: number
  section: number
  exercises_total: number
  exercises_completed: number
  required_actions: RequiredAction[]
}

export interface RequiredActionObject {
  value: RequiredAction
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
