import { createContext } from "react"
import { PointsByGroup } from "../modelTypes"

export interface CourseProgressProviderInterface {
  refreshProgress?: () => void
  error?: boolean
  loading?: boolean
  userCourseProgress?: PointsByGroup[]
  requiredActions?: any[]
}

const CourseProgressProviderContext = createContext<
  CourseProgressProviderInterface
>({})

export default CourseProgressProviderContext
