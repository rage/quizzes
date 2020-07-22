import React from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import useSWR from "swr"
import { useRouter } from "next/router"
import { getAllAnswers, fetchQuiz } from "../../../../services/quizzes"
import { AnswerList } from "../../../../components/AnswerList"
import usePromise from "react-use-promise"

export const AllAnswers = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const [answerResponse, answerError] = usePromise(
    () => getAllAnswers(quizId),
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
      label: "All Answers",
    },
  ])

  return <AnswerList data={answerResponse} error={answerError} />
}

export default AllAnswers
