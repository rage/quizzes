import React, { createContext, useContext, useReducer } from "react"
import { ProviderBaseInterface } from "./courseStatusProviderContext"
import { PointsByGroup } from "../modelTypes"

export interface ProgressResponse {
  user_course_progressess: UserCourseProgress
  completions: Completion[]
}

export interface CourseResponse {
  exercises: Omit<Exercise, "exercise_completions">[]
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

export interface CourseProgressProviderInterface extends ProviderBaseInterface {
  error?: boolean
  loading?: boolean
  courseProgressData?: ProgressData
}

type CourseProgressProviderActionTypes =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_COURSE_PROGRESS"; payload: ProgressData }
  | { type: "SET_ERROR"; payload: boolean }
  | {
      type: "SET_ALL"
      payload: CourseProgressProviderInterface
    }

// const initialState: CourseProgressProviderInterface = {
//   error: false,
//   loading: false,
// }

export const courseProgressReducer = (
  state: CourseProgressProviderInterface,
  action: CourseProgressProviderActionTypes,
): CourseProgressProviderInterface => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_COURSE_PROGRESS":
      return { ...state, courseProgressData: { ...action.payload } }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_ALL":
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error,
        courseProgressData: action.payload.courseProgressData,
      }
    default:
      throw new Error(`Unhandled action type.}`)
  }
}

const CourseProgressContext = createContext<
  | {
      state: CourseProgressProviderInterface
      dispatch: React.Dispatch<CourseProgressProviderActionTypes>
    }
  | undefined
>(undefined)

export const setLoading = (
  value: boolean,
): CourseProgressProviderActionTypes => {
  return {
    type: "SET_LOADING",
    payload: value,
  }
}

export const setAll = (
  value: CourseProgressProviderInterface,
): CourseProgressProviderActionTypes => {
  return {
    type: "SET_ALL",
    payload: value,
  }
}

export const CourseProgressProvider = ({
  children,
  courseProgress,
}: {
  children: React.ReactElement
  courseProgress: CourseProgressProviderInterface
}): JSX.Element => {
  const [_, dispatch] = useReducer(courseProgressReducer, courseProgress)
  return (
    <CourseProgressContext.Provider value={{ state: courseProgress, dispatch }}>
      {children}
    </CourseProgressContext.Provider>
  )
}

export const useCourseProgressState = () => {
  const context = useContext(CourseProgressContext)
  if (context === undefined) {
    throw new Error(
      "useCourserProgressState must be used within a CourseProgressProvider",
    )
  }
  return context
}
