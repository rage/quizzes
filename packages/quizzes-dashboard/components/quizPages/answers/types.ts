import { Answer } from "../../../types/Answer"
import { Course, Quiz } from "../../../types/Quiz"

export type TAnswersDisplayed = 10 | 50 | 100

export type TSortOptions = "asc" | "desc"

export interface IQueryParams {
  queryParams: {
    page: string
    quizId: string
    pageNo?: number
    answers?: TAnswersDisplayed
    expandAll?: string | boolean
    sort?: TSortOptions
    filters?: string | string[]
  }
}

export interface ChipProps {
  checked: boolean
}

export interface AnswerListProps {
  data: Answer[]
  error: any
  expandAll: boolean
}

export interface IQuizTabProps {
  quiz: Quiz
  course: Course
  userAbilities?: string[] | undefined
}
