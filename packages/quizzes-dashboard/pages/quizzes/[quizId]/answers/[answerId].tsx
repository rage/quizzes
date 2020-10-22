import React, { useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import usePromise from "react-use-promise"
import { fetchQuiz, getAnswerById } from "../../../../services/quizzes"
import AnswerCard from "../../../../components/Answer"
import styled from "styled-components"
import { Skeleton } from "@material-ui/lab"
import {
  TabTextLoading,
  TabText,
  TabTextError,
} from "../../../../components/quizPages/TabHeaders"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

export const AnswerById = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const answerId = route.query.answerId?.toString() ?? ""

  const [expanded, setExpanded] = useState(true)

  const [answerResponse, answerError] = usePromise(
    () => getAnswerById(answerId),
    [],
  )

  const [quiz, quizError] = usePromise(() => fetchQuiz(quizId), [quizId])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quiz?.courseId}/listing`,
      href: "/courses/[courseId]/[...page]",
    },
    {
      label: `${quiz?.title}`,
      as: `/quizzes/${quizId}/overview`,
      href: "/quizzes/[quizId]/overview",
    },
    {
      label: "All Answers",
      as: `/quizzes/${quizId}/all-answers`,
      href: "/quizzes/[quizId]/all-answers",
    },
    {
      label: "Answer",
    },
  ])

  if (answerError || quizError) {
    return (
      <>
        <TabTextError />
        <div>Something went wrong...</div>
      </>
    )
  }

  if (!answerResponse || !quiz) {
    return (
      <>
        <TabTextLoading />
        <StyledSkeleton variant="rect" height={300} animation="wave" />
      </>
    )
  }

  return (
    <>
      <TabText text="Singular answer" />
      <AnswerCard answer={answerResponse} expanded={expanded} />
    </>
  )
}

export default AnswerById
