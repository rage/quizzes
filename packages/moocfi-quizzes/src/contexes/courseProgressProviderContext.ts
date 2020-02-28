import { createContext } from "react"
import { PointsByGroup } from "../modelTypes"

export interface CourseProgressProviderInterface {
  error?: boolean
  loading?: boolean
  userCourseProgress?: PointsByGroup[]
  requiredActions?: any[]
  updateQuiz?: { [id: string]: boolean }
  quizUpdated?: (id: string) => void
}

const CourseProgressProviderContext = createContext<
  CourseProgressProviderInterface
>({})

export default CourseProgressProviderContext
