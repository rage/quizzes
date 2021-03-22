import { createContext } from "react"

export interface ProviderBaseInterface {
  notifyError?: (message: string) => void
}

export interface CourseStatusProviderInterface extends ProviderBaseInterface {
  updateQuiz?: { [id: string]: boolean }
  quizUpdated?: (id: string) => void
}

export const CourseStatusProviderContext = createContext<
  CourseStatusProviderInterface
>({})
