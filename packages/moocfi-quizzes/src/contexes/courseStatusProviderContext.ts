import { createContext } from "react"
import { PointsByGroup } from "../modelTypes"

export interface ProgressData {
  completed: boolean
  n_points: number
  max_points: number
  progressByGroup: ProgressByGroup
  exercisesByPart: ExercisesByPart
  answersByPart: AnswersByPart
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

type RequiredAction =
  | "rejected in peer review"
  | "give peer reviews"
  | "waiting for peer reviews"

export interface CourseProgressProviderInterface {
  error?: boolean
  loading?: boolean
  data?: ProgressData
  updateQuiz?: { [id: string]: boolean }
  quizUpdated?: (id: string) => void
  notifyError?: (message: string) => void
}

const CourseProgressProviderContext = createContext<
  CourseProgressProviderInterface
>({})

export default CourseProgressProviderContext
