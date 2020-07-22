import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import {
  getAnswersRequiringAttention,
  fetchQuiz,
} from "../../../../services/quizzes"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { AnswerList } from "../../../../components/AnswerList"
import usePromise from "react-use-promise"

export const RequiringAttention = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""

  const [answerResponse, answerError] = usePromise(
    () => getAnswersRequiringAttention(quizId),
    [],
  )

  const [quizResponse, quizError] = usePromise(() => fetchQuiz(quizId), [])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quizResponse?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: "Quiz",
      as: `/quizzes/${quizId}/edit`,
      href: "/quizzes[quizId]/edit",
    },
    {
      label: "Answers Requiring Attention",
    },
  ])

  return <AnswerList data={answerResponse} error={answerError} />
}

export default RequiringAttention
