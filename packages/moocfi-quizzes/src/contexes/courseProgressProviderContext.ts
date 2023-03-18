import React, { createContext, useContext, useReducer } from "react"

import { ProviderBaseInterface } from "./courseStatusProviderContext"
import { PointsByGroup } from "../modelTypes"

export interface UserCourseSummaryResponse {
  user_course_progress: Omit<UserCourseProgress, "course">
  completion: Completion
  course: UserCourseSummaryCourseResponse
  exercise_completions: Array<ExerciseCompletion>
}

export interface UserCourseSummaryCourseResponse {
  points_needed: number
  exercises: Array<Omit<Exercise, "exercise_completions">>
}
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
  courseId?: string
  loggedIn?: boolean
}

export interface CourseProgressProviderContextInterface {
  progress: CourseProgressProviderInterface
  fetchProgressData: () => Promise<void>
}

export const CourseProgressProviderContext = createContext<
  CourseProgressProviderContextInterface
>({ progress: {}, fetchProgressData: () => Promise.resolve() })
